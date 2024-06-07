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

    public function getUser() {
        $ajax = [];
        session_start();
        $ajax['user'] = $_SESSION['user'];
        session_write_close();

        echo json_encode($ajax);
    }

    public function updateUser() {
        $messages = [];
        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $prenom             = $_POST['prenom'];
        $nom                = $_POST['nom'];
        $email              = $_POST['email'];
        $newPassword        = $_POST['newPassword'];
        $newPasswordVerify  = $_POST['newPasswordVerify'];
        if (isset($_POST['publicity'])) $publicity = $_POST['publicity'];
        else                            $publicity = null;
        $password           = $_POST['password'];
        
        $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);


        if ($prenom == "" || $nom == "" || $email == "" || $password == "" || $publicity == null) {
            array_push($messages, ["info", CHAMPS_VIDES]);
        }
        elseif (!str_contains($email, '@') || !str_contains(explode('@', $email)[1], '.')) {
            array_push($messages, ["info", MAIL_INCORRECT]);
        }
        elseif ($newPassword != $newPasswordVerify) {
            array_push($messages, ["danger", MDP_NON_IDENTIQUES]);
        }

        if (sizeof($messages) == 0) {
            $user->set_prenom($prenom);
            $user->set_nom($nom);
            $user->set_email($email);
            
            if ($newPassword != "") $pass = $newPassword;
            else                    $pass = $password;
    
            $daoUser->updateUser($user, $pass);
        }

        require_once "src/view/moncompte.php";
    }
}