<?php
require_once "src/dao/DAOMN90.php";
require_once "src/dao/DaoPlongee.php";
require_once "src/metier/Plongee.php";
class cntrlApp {
    public function getInitialAccueil() {
        // TODO: Autre page pour la première page, qui dépend de si l'utilisateur est connecté ou non.
        $page = "";
        $page .= file_get_contents("src/view/header.html");
        $page .= file_get_contents("src/view/accueil.html");
        $page .= file_get_contents("src/view/footer.html");

        print_r($page);
    }

    public function getAccueil($ajax) {
        $ajax['html'] = file_get_contents("src/view/accueil.html");

        echo json_encode($ajax);
    }

    public function getRecherche($ajax) {
        $ajax['html'] = file_get_contents("src/view/recherche.html");

        echo json_encode($ajax);
    }

    public function getModalConnexion() {
        $ajax['connexion'] = file_get_contents("src/view/connexion-modal.html");

        echo json_encode($ajax);
    }

    public function getModalInscription() {
        $ajax['connexion'] = file_get_contents("src/view/inscription-modal.html");

        echo json_encode($ajax);
    }

    public function getMesPlongees($ajax) {
        if ($ajax['user'] == null) {
            $this->getAccueil($ajax);
        }
        else {
            $ajax['html'] = file_get_contents("src/view/mesplongees.html");

            echo json_encode($ajax);
        }
    }

    public function getModalPlongees() {
        $ajax = [];

        $ajax['modal'] = file_get_contents("src/view/plongees-modal.html");
        echo json_encode($ajax);
    }

    public function getAjoutPlongee($ajax = []) {
        session_start();
        $user = $_SESSION['user'];
        session_write_close();
        if ($user == null) {
            $this->getAccueil($ajax);
        }
        else {
            $ajax = [];
            parse_str(file_get_contents("php://input"), $_PUT);
            $volume         = $_PUT["volume"];
            $pression       = $_PUT["pression"];
            $profondeur     = $_PUT["profondeur"];
            $jour           = $_PUT["jour"];
            $duree          = $_PUT["duree"];
            $note           = $_PUT["note"];
            $description    = $_PUT["description"];

            if ($volume == "" || $pression == "" || $profondeur == "" || $jour == "" || $duree == "") {
                $ajax['warning'] = [CHAMPS_VIDES];
            }
            else {
                $jourFormatted = explode('-', $jour);
    
                $day = date("Y-m-d", mktime(6, null, null, $jourFormatted[1], $jourFormatted[2], $jourFormatted[0]));
        
                $daoPlongee = new DaoPlongee(DBHOST, DBNAME, PORT, USER, PASS);
                $tmpPlongee = new Plongee(null, $profondeur, $duree, $pression, $volume, $note, $day, $description, $user);
    
                $plongee = $daoPlongee->addPlongee($tmpPlongee);
    
                if (gettype($plongee) == "array") {
                    $ajax['warning'] = $plongee;
                }
                else {
                    $ajax["success"] = [PLONGEE_AJOUTEE];
                    $ajax["plongee"] = $plongee->toArray();
                }
            }
            echo json_encode($ajax);
        }
    }

    public function getIfMN90() {
        $ajax = [];

        $profondeur = $_GET['profondeur'];
        $duree      = $_GET['duree'];

        $daoMN90 = new DaoMN90(DBHOST, DBNAME, PORT, USER, PASS);
        if ($daoMN90->getIfExistsFromDureeEtProfondeur($duree, $profondeur))    $ajax['tag'] = ['<span class="badge bg-info-subtle text-info-emphasis rounded-pill">MN90</span>'];
        else                                                                    $ajax['tag'] = [];

        echo json_encode($ajax);
    }
}