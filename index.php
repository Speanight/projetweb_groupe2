<?php
// On récupère les fichiers nécessaires.
require_once "src/appli/cntrlApp.php";
require_once "src/appli/cntrlUser.php";
require_once "src/appli/cntrlPlongee.php";

// TODO: Cacher les erreurs sur le rendu final !
// On affiche les erreurs php.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// On initialise les controlleurs.
$cntrlApp = new cntrlApp();
$cntrlUser = new cntrlUser();
$cntrlPlongee = new cntrlPlongee();

// On récupère la session si l'utilisateur est connecté.
session_start();
if (isset($_SESSION['user']))   $user = $_SESSION['user'];
else                            $user = null;
session_write_close();

// On récupère le header et footer (pour éviter des répétitions dans chaque page)
$ajax = [];
$ajax['header'] = file_get_contents("src/view/header.html");
$ajax['footer'] = file_get_contents("src/view/footer.html");
$ajax['user']   = $user;

// On récupère le contexte
$method = $_SERVER["REQUEST_METHOD"];
$uri = explode("?", $_SERVER["REQUEST_URI"])[0];

// On redirige dans le chemin nécessaire.
if ($method == "GET") {
    if ($uri == "/")                            $cntrlApp->getInitialAccueil();
    elseif ($uri == "/accueil")                 $cntrlApp->getAccueil($ajax);
    elseif ($uri == "/recherche")               $cntrlApp->getRecherche($ajax);
    elseif ($uri == "/modal/connexion")         $cntrlApp->getModalConnexion();
    elseif ($uri == "/formparam/duree")         $cntrlPlongee->getDureeFromForm();
    elseif ($uri == "/formparam")               $cntrlApp->getFormParam($ajax);
    elseif ($uri == "/graph")                   $cntrlPlongee->getGraph($ajax);
    elseif ($uri == "/table")                   $cntrlApp->getTable($ajax);
    elseif ($uri == "/profils")                 $cntrlApp->getProfils($ajax);
    elseif ($uri == "/modal/inscription")       $cntrlApp->getModalInscription();
    elseif ($uri == "/modal/ajout/plongee")     $cntrlApp->getModalPlongees();
    elseif ($uri == "/profil/mesplongees")      $cntrlApp->getMesPlongees($ajax);
    elseif ($uri == "/plongee/verify")          $cntrlApp->getIfMN90();
    elseif ($uri == "/modal/edit/plongee")      $cntrlApp->getModalEditPlongee();
    elseif ($uri == "/profil/get/plongees")     $cntrlApp->getPlongeesUser();
    elseif ($uri == "/profil/get/tags")         $cntrlApp->getTagsUser();
    elseif ($uri == "/profil/edit")             $cntrlApp->getMonCompte($ajax);
    elseif ($uri == "/profil/get")              $cntrlUser->getUser();
    elseif ($uri == "/profil/amis")             $cntrlUser->getPageAmis($ajax);
    elseif ($uri == "/modal/profile/add/ami")   $cntrlUser->getModalAddAmi();
    elseif ($uri == "/profil/amis/actualite")   $cntrlUser->getActualitesAmis();
    elseif ($uri =="/profil/get/amis")          $cntrlUser->getListeAmis();
    elseif ($uri == "/getprof")                 $cntrlPlongee->getProf();
    elseif ($uri == "/getplongeeprof")          $cntrlPlongee->getProfPlongee();
    elseif ($uri == "/dbgettable")              $cntrlPlongee->getMN90Plongees();
    elseif ($uri == "/getplongees")             $cntrlPlongee->getAllPlongees();
    else                                        $cntrlApp->getAccueil($ajax);

}
elseif ($method == "POST") {
    if ($uri == "/connexion")                   $cntrlUser->getConnexion();
    elseif ($uri == "/deconnexion")             $cntrlUser->getDeconnexion();
    elseif ($uri == "/profil/update")           $cntrlUser->updateUser();
    elseif ($uri = "/profil/edit/tag")          $cntrlUser->updateTag();
}
elseif ($method == "PUT") {
    if ($uri == "/inscription")                 $cntrlUser->getInscription();
    elseif ($uri == "/profil/add/plongee")      $cntrlApp->getAjoutPlongee($ajax);
    elseif ($uri == "/profil/add/tag")          $cntrlApp->addTagUser();
    elseif ($uri == "/profil/add/ami")          $cntrlUser->getAjoutAmi();
}
elseif ($method == "UPDATE") {
    if ($uri == "/profil/update/tag")           $cntrlUser->updateTag();
}
elseif ($method == "DELETE") {
    if ($uri == "/profil/delete/tag")           $cntrlUser->deleteTag();
    elseif ($uri == "/profil/delete/plongee")   $cntrlUser->deletePlongee();
    elseif ($uri == "/profil/delete/ami")       $cntrlUser->deleteAmi();
}