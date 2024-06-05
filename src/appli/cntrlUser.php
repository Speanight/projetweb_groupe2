<?php
require_once "src/appli/utils.php";
require_once "src/metier/User.php";
require_once "src/dao/DaoUser.php";
require_once "src/view/Messages.php";

class cntrlUser {
    public function getConnexion() {
        $mail = $_POST["mail"];
        $password = $_POST["pass"];

        $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);

        $user = $daoUser->getUserConnection($mail, $password);

        echo json_encode($user);
    }

    public function getInscription() {
        parse_str(file_get_contents("php://input"), $_PUT);
        $prenom         = $_PUT["prenom"];
        $nom            = $_PUT["nom"];
        $email          = $_PUT["email"];
        $password       = $_PUT["password"];
        $passwordVerify = $_PUT["passwordVerify"];
        
        $ajax = [];

        $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);
        $tmpUser = new User(null, $nom, $prenom, $email, "unknown.png");

        if ($password != $passwordVerify) {
            $ajax["danger"] = MDP_NON_IDENTIQUES;
        }
        else {
            $hashedPass = password_hash($password, PASSWORD_BCRYPT);
            $success = $daoUser->getUserInscription($tmpUser, $hashedPass);

            $ajax["success"] = COMPTE_CREE;
        }

        echo json_encode($ajax);
    }
}