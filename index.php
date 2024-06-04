<?php
// On récupère les fichiers nécessaires.
require_once "src/appli/cntrlApp.php";

// On affiche les erreurs php.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// On récupère le header et footer (pour éviter des répétitions dans chaque page)
$ajax = [];
$ajax['header'] = file_get_contents("src/view/header.html");
$ajax['footer'] = file_get_contents("src/view/footer.html");

// On initialise les controlleurs.
$cntrlApp = new cntrlApp($ajax);


// On récupère le contexte
$method = $_SERVER["REQUEST_METHOD"];
$uri = explode("?", $_SERVER["REQUEST_URI"])[0];

// On redirige dans le chemin nécessaire.
if ($method == "GET") {
    if ($uri == "/")                $cntrlApp->getInitialAccueil();
    elseif ($uri == "/accueil")     $cntrlApp->getAccueil();
    elseif ($uri == "/recherche")   $cntrlApp->getRecherche();
    else                            $cntrlApp->getAccueil();
}