<?php
require_once "src/dao/DaoMN90.php";
require_once "src/dao/DaoPlongee.php";
require_once "src/dao/DaoTag.php";
require_once "src/dao/DaoTagsPlongee.php";
require_once "src/metier/Plongee.php";
require_once "src/metier/Tag.php";
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

    public function getRechercheTable($ajax) {
        $ajax['html'] = file_get_contents("src/view/table.html");

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
        $ajax['tags'] = [];
        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $ajax['modal'] = file_get_contents("src/view/plongees-modal.html");
        $daoTag = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);
        $tags = $daoTag->getTagsOfUser($user);

        foreach ($tags as $tag) {
            array_push($ajax['tags'], $tag->toArray());
        }

        echo json_encode($ajax);
    }

    public function getFormParam($ajax){
        $ajax['html'] = file_get_contents("src/view/view-param.html");

        echo json_encode($ajax);

    }

    public function getTable($ajax){

        $ajax['html'] = file_get_contents("src/view/table.html");
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
            $rawTags        = $_PUT["tags"];

            $tags = explode(",", $rawTags);

            if ($volume == "" || $pression == "" || $profondeur == "" || $jour == "" || $duree == "") {
                $ajax['warning'] = [CHAMPS_VIDES];
            }
            else {
                $jourFormatted = explode('-', $jour);
    
                $day = date("Y-m-d", mktime(6, null, null, $jourFormatted[1], $jourFormatted[2], $jourFormatted[0]));
        
                $daoPlongee = new DaoPlongee(DBHOST, DBNAME, PORT, USER, PASS);
                $tmpPlongee = new Plongee(null, $profondeur, $duree, $pression, $volume, $note, $day, $description, $user);
    
                $plongee = $daoPlongee->addPlongee($tmpPlongee, $tags);
    
                if (gettype($plongee) == "array") {
                    $ajax['warning'] = $plongee;
                }
                else {
                    $ajax["success"] = [PLONGEE_AJOUTEE];
                    $ajax["plongee"] = $plongee->toArray();

                    $daoTag = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);
                    $daoTagsPlongee = new DaoTagsPlongee(DBHOST, DBNAME, PORT, USER, PASS);
                    for ($i=0; $i < sizeof($tags); $i++) {
                        // print_r($tags);
                        $daoTagsPlongee->addTagToPlongee($plongee, $tags[$i]);
                        $plongee->add_tag($daoTag->getTagById($user, $tags[$i]));
                    }
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
        if ($daoMN90->getIfExistsFromDureeEtProfondeur($duree, $profondeur))    $ajax['tags'] = [['<span id="tag-1" class="badge bg-info-subtle text-info-emphasis rounded-pill">MN90</span>']];
        else                                                                    $ajax['tags'] = [];

        echo json_encode($ajax);
    }

    public function getPlongeesUser() {
        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $ajax = [];
        $ajax['plongees'] = [];

        $daoPlongee = new DaoPlongee(DBHOST, DBNAME, PORT, USER, PASS);
        $daoTagPlongee = new DaoTagsPlongee(DBHOST, DBNAME, PORT, USER, PASS);
        $plongees = $daoPlongee->getPlongeesOfUser($user);

        foreach ($plongees as $plongee) {
            $plongee = $daoTagPlongee->getTagsOfPlongee($user, $plongee);
            array_push($ajax['plongees'], $plongee->toArray());
        }

        echo json_encode($ajax);
    }

    public function getTagsUser() {
        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $ajax = [];
        $ajax['tags'] = [];

        $daoTag = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);
        $tags = $daoTag->getTagsOfUser($user);

        foreach ($tags as $tag) {
            array_push($ajax['tags'], $tag->toArray());
        }

        echo json_encode($ajax);
    }

    public function addTagUser() {
        session_start();
        $user = $_SESSION['user'];
        session_write_close();
        parse_str(file_get_contents("php://input"), $_PUT);
        $nom = $_PUT['nom'];
        $type = $_PUT['type'];


        $ajax = [];
        $ajax['tags'] = [];

        $daoTags = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);
        $tmpTag = new Tag(null, $nom, $user, $type);
        $tag = $daoTags->addTag($tmpTag);

        if (gettype($tag) != "array") {
            $ajax['success'] = [TAG_AJOUTE];
        }
        else {
            $ajax['warning'] = $tag;
        }

        $tags = $daoTags->getTagsOfUser($user);

        foreach ($tags as $tag) {
            array_push($ajax["tags"], $tag->toArray());
        }

        echo json_encode($ajax);
    }

    public function getMonCompte($ajax) {
        $ajax['html'] = file_get_contents("src/view/moncompte.html");

        echo json_encode($ajax);
    }

    public function getModalEditPlongee() {
        $ajax = [];
        $ajax['modal'] = file_get_contents("src/view/plongee-edit-modal.html");

        echo json_encode($ajax);
    }

    public function getProfils($ajax){

        $ajax['html'] = file_get_contents("src/view/profils.html");

        echo json_encode($ajax);

    }
}