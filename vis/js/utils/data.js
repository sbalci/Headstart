import { stringCompare } from "./string";

/**
 * Filters the input data according to the provided settings.
 * @param {Array} data input array that contains papers
 * @param {Object} searchSettings 'value' = search string
 * @param {Object} filterSettings 'value' = filter mode, 'field' = what field
 * to match to 'value', 'area' = uri of the zoomed-in area, 'paper' = id of the
 * selected paper
 *
 * @returns {Array} filtered data array
 */
export const filterData = (data, searchSettings, filterSettings) => {
  if (filterSettings.paper) {
    data = data.filter((e) => e.safe_id === filterSettings.paper);
  }

  if (filterSettings.zoomed) {
    if (filterSettings.isStreamgraph) {
      data = data.filter((e) => {
        let keywords = !!e.subject_orig ? e.subject_orig : "";
        let array = keywords.split("; ");

        return array.includes(filterSettings.title);
      });
    } else {
      data = data.filter(
        (e) => e.area_uri.toString() === filterSettings.area.toString()
      );
    }
  }

  let filterValue = filterSettings.value;
  let filterField = filterSettings.field;

  data = data.filter(getParamFilterFunction(filterValue, filterField));

  let searchWords = parseSearchText(searchSettings.value);
  if (searchWords.length > 0) {
    data = data.filter(getWordFilterFunction(searchWords));
  }

  return data;
};

/**
 * Returns the search text keywords.
 * @param {String} searchText plaintext
 *
 * @returns {Array} keywords array
 */
export const parseSearchText = (searchText) => {
  return searchText
    .split(" ")
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word !== "");
};

const getParamFilterFunction = (param, field) => {
  if (typeof field === "undefined" || field === null) {
    if (param === "open_access") {
      return (d) => d.oa;
    }

    if (param === "publication") {
      return (d) => d.resulttype === "publication";
    }

    if (param === "dataset") {
      return (d) => d.resulttype === "dataset";
    }

    return () => true;
  }

  if (param === "all") {
    return () => true;
  }

  return (d) => d[field] === param;
};

/**
 * Creates a paper filtering function from the search words.
 *
 * Function taken from legacy list.js
 * @param {Array} search_words array of search words (plaintext strings)
 *
 * @returns {Function} filtering function
 */
const getWordFilterFunction = (search_words) => {
  return (d) => {
    let abstract = getPropertyOrEmptyString(d, "paper_abstract");
    let title = getPropertyOrEmptyString(d, "title");
    let authors = getPropertyOrEmptyString(d, "authors_string");
    let journals = getPropertyOrEmptyString(d, "published_in");
    let year = getPropertyOrEmptyString(d, "year");
    let keywords = getPropertyOrEmptyString(d, "subject_orig");
    let tags = getPropertyOrEmptyString(d, "tags");
    let comments = getPropertyOrEmptyString(d, "comments_for_filtering");
    let resulttype = getPropertyOrEmptyString(d, "resulttype");
    // TODO: make these two properties language-aware
    let open_access = !!d.oa ? "open access" : "";
    let free_access = !!d.free_access ? "free access" : "";

    let i = 0;
    let word_found = true;
    while (word_found && i < search_words.length) {
      word_found =
        abstract.indexOf(search_words[i]) !== -1 ||
        title.indexOf(search_words[i]) !== -1 ||
        authors.indexOf(search_words[i]) !== -1 ||
        journals.indexOf(search_words[i]) !== -1 ||
        year.indexOf(search_words[i]) !== -1 ||
        keywords.indexOf(search_words[i]) !== -1 ||
        tags.indexOf(search_words[i]) !== -1 ||
        comments.indexOf(search_words[i]) !== -1 ||
        resulttype.indexOf(search_words[i]) !== -1 ||
        open_access.indexOf(search_words[i]) !== -1 ||
        free_access.indexOf(search_words[i]) !== -1;
      i++;
    }

    return word_found;
  };
};

const getPropertyOrEmptyString = (object, property) => {
  return object.hasOwnProperty(property)
    ? object[property].toString().toLowerCase()
    : "";
};

/**
 * Sorts the input data according to the provided settings.
 * @param {Array} data input array that contains papers
 * @param {Object} sortSettings 'value' = name of the sort param
 *
 * @returns {Array} sorted data array
 */
export const sortData = (data, sortSettings) => {
  return data.sort(getParamSortFunction(sortSettings.value));
};

const getParamSortFunction = (field) => {
  if (field === "year") {
    return (a, b) => stringCompare(a[field], b[field], "desc");
  }

  if (
    field === "relevance" ||
    field === "citations" ||
    field === "readers" ||
    field === "tweets"
  ) {
    return (a, b) => stringCompare(a[field], b[field], "desc");
  }

  return (a, b) => stringCompare(a[field], b[field], "asc");
};

/**
 * Synchronously checks whether the file with given url exists.
 *
 * Function taken from legacy list.js
 *
 * @param {String} url
 *
 * @returns {Boolean} true if the file exists
 */
export const isFileAvailable = (url) => {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();

  return http.status !== 404;
};

/**
 * Returns the paper's preview image.
 * @param {Object} paper
 * 
 * @returns {String} the preview image url
 */
export const getPaperPreviewImage = (paper) => {
  return "paper_preview/" + paper.id + "/page_1.png";
};

/**
 * Returns the paper's preview link.
 * @param {Object} paper
 * 
 * @returns {String} the preview link url
 */
export const getPaperPreviewLink = (paper) => {
  if (paper.oa && paper.link !== "") {
    return null;
  }

  return paper.outlink;
};

/**
 * Returns the paper's pdf click handler.
 * @param {Object} paper
 * @param {Function} handlePDFClick
 * 
 * @returns {Function} function that opens the pdf preview
 */
export const getPaperPDFClickHandler = (paper, handlePDFClick) => {
  if (
    paper.oa === false ||
    paper.resulttype == "dataset" ||
    paper.link === ""
  ) {
    return null;
  }

  return () => handlePDFClick(paper);
};

/**
 * Returns the paper's keywords.
 * @param {Object} paper
 * @param {Object} localization
 * 
 * @returns {String} the keywords or a fallback string in current language
 */
export const getPaperKeywords = (paper, localization) => {
  if (!paper.hasOwnProperty("subject_orig") || paper.subject_orig === "") {
    return localization.no_keywords;
  }

  return paper.subject_orig;
};

/**
 * Returns the paper's classification.
 * @param {Object} paper
 * @param {Object} localization
 * 
 * @returns {String} the classification or a fallback string in current language
 */
export const getPaperClassification = (paper, localization) => {
  if (!paper.hasOwnProperty("bkl_caption") || paper.bkl_caption === "") {
    return localization.no_keywords;
  }

  return paper.bkl_caption;
};

/**
 * Returns the paper's text link.
 * @param {Object} paper 
 * @param {String} linkType covis/url/doi/<null>
 * 
 * @returns {Object} link object with properties 'address' and 'isDoi'
 */
export const getPaperTextLink = (paper, linkType) => {
  if (linkType === "covis") {
    let address = paper.url;
    if (typeof address !== "string" || address === "") {
      address = "n/a";
    }
    return { address, isDoi: false };
  }

  if (linkType === "url") {
    return { address: paper.outlink, isDoi: false };
  }

  if (linkType === "doi") {
    if (paper.doi) {
      return { address: paper.doi, isDoi: true };
    }

    if (paper.link) {
      return { address: paper.link, isDoi: false };
    }

    // fallback for PubMed
    if (paper.url) {
      return { address: paper.url, isDoi: false };
    }
  }

  return {};
};

/**
 * Returns the paper's comments.
 * @param {Object} paper 
 * 
 * @returns {Array} comments array or null
 */
export const getPaperComments = (paper) => {
  let comments = paper.comments;
  if (!comments || comments.length === 0) {
    return null;
  }

  return comments;
};

/**
 * Returns the paper's tags.
 * @param {Object} paper 
 * 
 * @returns {Array} tags array or null
 */
export const getPaperTags = (paper) => {
  if (!paper.tags) {
    return null;
  }

  let tags = paper.tags.split(/, |,/g).filter((tag) => !!tag);
  if (tags.length > 0) {
    return tags;
  }

  return null;
};
