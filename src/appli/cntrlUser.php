<?php
require_once "src/appli/utils.php";
require_once "src/metier/User.php";
require_once "src/dao/DaoUser.php";
require_once "src/view/Messages.php";

class cntrlUser {
    public function getConnexion() {
        $ajax = [];
        $mail = $_POST["mail"];
        $password = $_POST["pass"];

        if ($mail == '' || $password == '') {
            $ajax['info'] = [CHAMPS_VIDES];
        }
        elseif (!str_contains($mail, '@') || !str_contains(explode('@', $mail)[1], '.')) {
            $ajax['info'] = [MAIL_INCORRECT];
        }
        else {
            $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);
    
            $user = $daoUser->getUserConnection($mail, $password);
    
            if ($user == null) {
                $ajax['warning'] = [CONNEXION_INCORRECTE];
            }
            else {
                $utils = new Utils();
                $utils->connectUser($user);
                $ajax['success'] = [CONNEXION_REUSSIE];
                $ajax['user'] = $user;
            }
        }


        echo json_encode($ajax);
    }

    public function getInscription() {
        parse_str(file_get_contents("php://input"), $_PUT);
        $prenom         = $_PUT["prenom"];
        $nom            = $_PUT["nom"];
        $email          = $_PUT["email"];
        $password       = $_PUT["password"];
        $passwordVerify = $_PUT["passwordVerify"];
        
        $ajax = [];

        if ($prenom == "" || $nom == "" || $email == "" || $password == "" || $passwordVerify == "") {
            $ajax['info'] = [CHAMPS_VIDES];
        }
        elseif (!str_contains($email, '@') || !str_contains(explode('@', $email)[1], '.')) {
            $ajax['info'] = [MAIL_INCORRECT];
        }
        elseif ($password != $passwordVerify) {
            $ajax['danger'] = [MDP_NON_IDENTIQUES];
        }
        else {
            $utils = new Utils();
            $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);
            $tmpUser = new User(null, $nom, $prenom, $email, "unknown.jpg");
            $hashedPass = password_hash($password, PASSWORD_BCRYPT);
            $user = $daoUser->getUserInscription($tmpUser, $hashedPass);

            if (gettype($user) == "array") {
                $ajax['danger'] = $user;
            }
            else {
                $ajax["success"] = [COMPTE_CREE];
                $utils->connectUser($user);
                $ajax['user'] = $user;
            }

        }


        echo json_encode($ajax);
    }

    public function getDeconnexion() {
        $ajax = [];
        session_start();
        $_SESSION['user'] = null;
        unset($_SESSION['user']);
        session_unset();
        session_destroy();
        session_write_close();

        $ajax['success'] = [DECONNEXION_REUSSIE];
        $ajax['user'] = null;

        echo json_encode($ajax);
    }
}