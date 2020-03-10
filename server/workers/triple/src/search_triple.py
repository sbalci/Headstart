import os
import json
import redis
from elasticsearch import Elasticsearch
import pandas as pd


with open("config.json") as infile:
    config = json.load(infile)

redis_store = redis.StrictRedis(host="localhost", port=6379, db=0)


class TripleClient(object):

    def __init__(self, config):
        self.es = Elasticsearch(
            [config.get('host')],
            http_auth=(config.get('user'), config.get('pass')),
            scheme="http" if config.get('host') == 'localhost' else "https",
            port=config.get('port'),
            send_get_body_as='POST',
            http_compress=True
        )

    def next_item(self):
        queue, msg = redis_store.blpop("triple")
        msg = json.loads(msg)
        k = msg.get('id')
        params = msg.get('params')
        params["service"] = "triple"
        endpoint = msg.get('endpoint')
        return k, params, endpoint

    def get_mappings(self, index):
        return self.es.indices.get_mapping(index)

    def build_date_field(self, _from, _to):
        date = {}
        date["gte"] = _from
        date["lte"] = _to
        return date

    def build_sort_order(self, parameters):
        sort = []
        if parameters.get('sorting') == "most-relevant":
            sort.append("_score:desc")
        if parameters.get('sorting') == "most-recent":
            sort.append("date:desc")
        return sort

    def search(self, parameters):
        index = "isidore-documents-triple"
        body = {"query": {
                    "bool": {
                        "must": [
                             {"multi_match": {
                                "query": parameters.get('q'),
                                "fields": ["title", "abstract"]
                             }},
                             {"range": {
                                "date": self.build_date_field(
                                        parameters.get('from'),
                                        parameters.get('to'))
                             }}
                        ]
                    }
                }}
        sort = self.build_sort_order(parameters)
        res = self.es.search(
            index=index,
            body=body,
            size=100,
            sort=sort)
        if parameters.get('raw'):
            return res
        else:
            return self.process_result(res)

    def process_result(self, result):
        """
        # * "id": a unique ID, preferably the DOI
        # * "title": the title
        # * "authors": authors, preferably in the format "LASTNAME1, FIRSTNAME1;LASTNAME2, FIRSTNAME2"
        # * "paper_abstract": the abstract
        # * "published_in": name of the journal or venue
        # * "year": publication date
        # * "url": URL to the landing page
        # * "readers": an indicator of the paper's popularity, e.g. number of readers, views, downloads etc.
        # * "subject": keywords or classification, split by ;
        # * "oa_state": open access status of the item; has the following possible states: 0 for no, 1 for yes, 2 for unknown
        # * "link": link to the PDF; if this is not available, a list of candidate URLs that may contain a link to the PDF
        """
        df = pd.DataFrame(result.get('hits').get('hits'))
        df = pd.concat([df.drop(["_source"], axis=1),
                        df["_source"].apply(pd.Series)],
                       axis=1)
        metadata = pd.DataFrame()
        metadata["id"] = df.identifier.map(lambda x: x[0] if isinstance(x, list) else "")
        metadata["title"] = df.title.map(lambda x: x[0] if isinstance(x, list) else "")
        metadata["authors"] = df.author.map(lambda x: self.get_authors(x) if isinstance(x, list) else "")
        metadata["abstract"] = df.abstract.map(lambda x: x[0] if isinstance(x, list) else "")
        metadata["published_in"] = df.publisher.map(lambda x: x[0].get('name') if isinstance(x, list) else "")
        metadata["year"] = df.datestamp.map(lambda x: x if isinstance(x, str) else "")
        metadata["url"] = df.url.map(lambda x: x[0] if isinstance(x, list) else "")
        metadata["readers"] = 0
        metadata["subject"] = df.keyword.map(lambda x: "; ".join(x) if isinstance(x, list) else "")
        input_data = {}
        input_data["metadata"] = metadata.to_json()
        input_data["text"] = metadata.apply(lambda x: ". ".join(x[["title", "abstract"]]), axis=1).to_json()
        return input_data

    @staticmethod
    def get_authors(authorlist):
        authors = []
        for a in authorlist:
            if a:
                author = []
                for n in ['lastname', 'firstname']:
                    if a.get(n, [None])[0]:
                        author.append(a.get(n)[0])
                authors.append(", ".join(author))
        return "; ".join(authors)

    def run(self):
        while True:
            k, params, endpoint = self.next_item()
            if endpoint == "mappings":
                res = self.get_mappings(params.get('index'))
                redis_store.set(k+"_output", json.dumps(res))
            if endpoint == "search":
                res = {}
                res["input_data"] = self.search(params)
                res["params"] = params
                redis_store.rpush("input_data", json.dumps(res))


if __name__ == '__main__':
    tc = TripleClient(config)
    tc.run()
