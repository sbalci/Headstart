<?php

header('Content-type: application/json');

require_once dirname(__FILE__) . '/../classes/headstart/library/CommUtils.php';
require 'search.php';

use headstart\library;

$dirty_query = library\CommUtils::getParameter($_POST, "q");
$precomputed_id = (isset($_POST["unique_id"]))?($_POST["unique_id"]):(null);
$persistence_backend = (isset($_POST["persistence_backend"]))?($_POST["persistence_backend"]):("api");

$post_params = $_POST;
unset($post_params["persistence_backend"]);

$result = search("triple", $dirty_query
                , $post_params, array("from", "to", "sorting", "vis_type", "language", "limit", "sg_method")
                , ";", null, true
                , true, null, 3
                , "area_uri", "subject"
                , $precomputed_id, true
                , "api", $persistence_backend);

echo $result

?>
