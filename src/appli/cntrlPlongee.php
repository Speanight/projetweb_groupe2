<?php 

require_once "utils.php";
require_once "src/dao/DaoMN90.php";
require_once "src/metier/Plongee.php";



class cntrlPlongee{
    
    public function getGraph($ajax){

        $DaoMN90 = new DaoMN90(DBHOST, DBNAME, PORT, USER, PASS);
        if(isset($_GET['duree']) && isset($_GET['profondeur'])){
            $profondeur = $_GET['profondeur'];
            $duree = $_GET['duree'];
            $plongee = new Plongee(null, $profondeur,$duree,200,3000, null, null, null, null, null);

        }
        else $plongee = NULL;

        $mn90 = $DaoMN90->getMn90OfPlongee($plongee);


        $paliers = $mn90->getPaliers();
    

        $ajax['mn90'] = [$mn90->getProfondeur(),$mn90->getDuree(),$paliers];

        print_r(json_encode($ajax));

    }

    public function getDureeFromForm(){

        $DaoMN90 = new DaoMN90(DBHOST, DBNAME, PORT, USER, PASS);

        if(isset($_GET['profondeur'])){
            $profondeur = $_GET['profondeur'];
        }
        else $profondeur = null;

        $duree = $DaoMN90->getDureeWithProfondeur($profondeur);

        $ajax['duree_dp'] = $duree;

        print_r(json_encode($ajax));

    }

    public function getProf(){

        $DaoMN90 = new DaoMN90(DBHOST, DBNAME, PORT, USER, PASS);


        $result = $DaoMN90->getProfOfMN90();

        $ajax['plongee'] = $result;

        print_r(json_encode($ajax));

    }

    public function getMN90Plongees(){

        $DaoMN90 = new DaoMN90(DBHOST, DBNAME, PORT, USER, PASS);

        if(isset($_GET['profondeur'])){
            $profondeur = $_GET['profondeur'];
        }

        $tablemn90 = $DaoMN90->getPlongeesOfMN90($profondeur);

       

        echo json_encode($tablemn90);


    }


}