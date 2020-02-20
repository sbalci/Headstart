<!DOCTYPE html>
<?php
include 'config.php';
$date = new DateTime();
?>
<html>
    <head>
        <title>LinkedCat+ Visuelle Suche</title>
        <?php include('head_standard.php') ?>
        <link type="text/css" rel="stylesheet" href="browse.css">
    </head>
    <body class="ueber-page">
        <div class="bg-image-startpage">
            <header>
                <?php include('menu.php'); ?>
            </header>

            <?php include('project-short-description.php') ?>

            <div class="browse-description">
                <h3>FAQs</h3>
                <p>Hier finden Sie Antworten zu den häufigsten gestellten Fragen.</p>
            </div>

            <div style="max-width:750px; background-color: white; text-transform: none;margin: 0px auto; font-size: 16px;">

                <h4 style="padding: 20px 40px 0; margin: 0px;">Was ist eine Knowledge Map?</h4>
                <p style="padding: 10px 40px;">
                    Eine Knowledge Map (zu deutsch "Wissenslandkarte") gibt einen thematischen Überblick über ein Stichwort/einen Autor. 
                    Unterthemen werden als Blasen dargestellt. Jedem Unterthema sind relevante Dokumente zugeordnet, die mit einem
                    Klick auf die Blase angezeigt werden können.
                    <br><br>
                    Die Größe der Blasen ist relativ zur Anzahl der zugeordneten Dokumente. Blasen, die sich thematisch ähnlich sind, werden näher zueinander dargestellt als
                    Blasen, die sich thematisch weniger ähnlich sind.
                    <br><br>
                    Knowledge Maps eignen sich besonders dazu, einen Überblick über ein Thema zu bekommen und relevante Konzepte und Dokumente zu entdecken.
                </p>

                <h4>Was ist ein Stream Graph?</h4>
                <p style="padding: 10px 40px;">
                    Ein Streamgraph zeigt die zeitliche Entwicklung der häufigsten Schlagworte zu einem Stichwort/Autor. 
                    Die Schlagworte werden als farbige Ströme (englisch "streams") dargestellt.  Jedem Strom sind relevante Dokumente zugeordnet, die mit einem
                    Klick auf die Blase angezeigt werden können.
                    <br><br>
                    Die Höhe eines Stroms entspricht der Anzahl der zugeordneten Dokumente zu einem bestimmten Zeitpunkt. 
                    Dabei ist zu beachten, dass die Anzahl der relativen, nicht der absoluten Höhe entspricht.
                    Zwischen den Zeitpunkten wird der Strom interpoliert.
                    <br><br>
                    Streamgraphs eignen sich besonders dazu, die Entwicklung von Schlagwörtern über die Zeit zu analysieren und Trends zu erkennen.
                </p>

                <h4>Was ist unter relevanteste Dokumente zu verstehen?</h4>
                <p style="padding: 10px 40px;">
                    In diesem Projekt verwenden wir das Relevanz-Ranking von Solr. Solr verwendet hauptsächlich die Textähnlichkeit zwischen dem Suchbegriff und den Dokument-Metadaten, um die Relevanz zu bestimmen. Mehr Informationen dazu <a target="_blank" href="http://lucene.apache.org/core/6_4_2/core/org/apache/lucene/search/package-summary.html#scoring">finden sie auf dieser Seite</a>.
                </p>

                <h4>Warum werden in einer Knowledge Map zur Stichwortsuche nur die 100 relevantesten Dokumente angezeigt?</h4>
                <p style="padding: 10px 40px;">
                    Wir wollen die Anzahl der Dokumente überschaubar halten. 100 Dokumente sind bereits die 10-fache Menge die auf einer Standard-Suchergebnis Seite angezeigt werden. Um tiefer in ein Thema einzutauchen, können Sie eine spezifischere Suchanfrage stellen. Sollten sie alle Dokumente zu einem Stichwort anzeigen wollen, verwenden Sie bitte den Streamgraph.
                </p>

                <h4>Wie werden die Dokumente in Bereiche aufgeteilt?
                </h4>
                <p style="padding: 10px 40px;">
                    Die Gruppierung der Artikel basiert auf den Dokument-Metadaten. Wir verwenden Titel und Schlagwörter, um eine Matrix für das gleichzeitige Auftreten von Wörtern zwischen Dokumentenzu erstellen. Auf diese Matrix wenden wir Clustering- und Layout-Algorithmen an. Die Beschriftungen für die Bereiche (Blasen) werden aus den Schlagworten der Artikel in diesem Bereich generiert. Mehr Informationen <a target="_blank" href="http://0277.ch/ojs/index.php/cdrs_0277/article/view/157/355">finden Sie in diesem Artikel</a>.
                </p>

                <h4>Hat die Lage der Bereiche (Blasen) und Dokumente innerhalb eines Bereichs (Blase) eine spezielle Bedeutung?</h4>

                <ul style="padding: 10px 40px 0;">
                    <li>Die Nähe von Bereichen impliziert thematische Ähnlichkeit. Je näher zwei Bereiche auf der Knowledge Map platziert sind, desto ähnlicher sind sie sich thematisch. Überlappen zwei Bereiche bedeutet dies nicht, dass diese Bereiche dieselben Dokumente enthalten. Dokumente werden immer nur einem Bereich zugeordnet.
                    </li>
                    <li>Die Zentralität der Bereiche (Blasen) impliziert die thematische Ähnlichkeit bezogen auf die gesamte Knowledge Map; dies hat nichts mit der Wichtigkeit eines Bereichs zu tun. Je zentraler ein Bereich (Blase) in der Knowledge Map liegt, desto mehr hat diesen thematisch mit allen restlichen Bereichen etwas gemeinsam. 
                    </li>
                </ul>
                <p style="padding: 0px 40px 10px;">
                    Dabei gilt zu beachten, dass die Lage der Bereiche (Blasen) innerhalb einer Knowledge Map lediglich ein Hinweis auf thematische Ähnlichkeit sind. Die Anordnung wird beim Laden entzerrt um die Knowledge Map besser lesbar zu gestalten. 
                    Die Lage eines Dokuments innerhalb eines Bereichs (Blase) hat keine Bedeutung. Um Überlappungen zu vermeiden wurden diese neu angeordnet. Mehr Informationen <a target="_blank" href="https://arxiv.org/abs/1412.6462">finden sie in diesem Artikel</a>.
                </p>

                <h4>Warum sind manche Visualisierungen (Knowledge Map oder Stream Graph) besser als andere?</h4>
                <p style="padding: 10px 40px;">
                    Beide Visualisierungen sind abhängig von den Ergebnissen die zu einer Suche gefunden werden. Wenn es z.B. nur wenige Dokumente zu einem Suchbegriff gibt oder wenn zu einem Dokument nur wenige Metadaten vorhanden sind, dann hat dies auch einen Einfluss auf die Qualität der Visualisierung. Die Metadaten werden kontinuierlich von den Bibliothekar*innen der BAS:IS aktualisiert und verbessert. Sollten Sie Fehler finden, schreiben Sie bitte eine E-Mail an: REPLACE with EMAIL.
                </p>

            </div>

            <?php include('credits.php') ?>
        </div>

        <script type="text/javascript" src="data-config_linkedcat.js"></script>
        <script>

</body>
</html>