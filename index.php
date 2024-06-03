<?php
// On récupère les fichiers nécessaires.
require_once "src/appli/cntrlApp.php";

// On initialise les controlleurs.
$cntrlAPp = new cntrlApp();


// On récupère le contexte
$method = $_SERVER["REQUEST_METHOD"];
$uri = explode("?", $_SERVER["REQUEST_URI"])[0];

// On redirige dans le chemin nécessaire.
if ($method == "GET") {
    if ($uri == "/")        $cntrlApp->getAccueil();
}