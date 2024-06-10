<?php
require_once "src/appli/utils.php";
require_once "src/metier/User.php";
require_once "src/dao/DaoUser.php";
require_once "src/dao/DaoFollow.php";
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
            $daoFollow = new DaoFollow(DBHOST, DBNAME, PORT, USER, PASS);
    
            $user = $daoUser->getUserConnection($mail, $password);
            
            if ($user == null) {
                $ajax['warning'] = [CONNEXION_INCORRECTE];
            }
            else {
                $user->set_following($daoFollow->getFollowing($user));
                $utils = new Utils();
                $utils->connectUser($user);
                $ajax['success'] = [CONNEXION_REUSSIE];
                $ajax['user'] = $user->toArray();
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
        $state          = $_PUT['state'];

        $ajax = [];

        if ($prenom == "" || $nom == "" || $email == "" || $password == "" || $passwordVerify == "" || $state == "") {
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
        if (isset($_SESSION['user'])) {
            $ajax['user'] = $_SESSION['user']->toArray();
        }
        else $ajax['user'] = null;
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
        $password           = $_POST['password'];
        if (isset($_POST['publicity'])) $publicity = $_POST['publicity'];
        else                            $publicity = null;

        $utils      = new Utils();
        $daoUser    = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);
        $daoTag     = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);

        if ($prenom == "" || $nom == "" || $email == "" || $password == "" || $publicity == null) {
            array_push($messages, ["info", CHAMPS_VIDES]);
        }
        elseif (!str_contains($email, '@') || !str_contains(explode('@', $email)[1], '.')) {
            array_push($messages, ["info", MAIL_INCORRECT]);
        }
        elseif ($newPassword != $newPasswordVerify) {
            array_push($messages, ["danger", MDP_NON_IDENTIQUES]);
        }
        elseif ($daoUser->getUserConnection($user->get_email(), $password) == null) {
            array_push($messages, ["danger", MOT_DE_PASSE_INCORRECT]);
        }
        else {
            $user->set_prenom($prenom);
            $user->set_nom($nom);
            $user->set_email($email);
            $user->set_state($publicity);
            
            if ($newPassword != "") $pass = $newPassword;
            else                    $pass = $password;
            $hashedPass = password_hash($pass, PASSWORD_BCRYPT);

            $daoUser->updateUser($user, $hashedPass);
        }

        if (!empty($_FILES)) {
            $bilan = $utils->savePicture($user->get_id(), "img", CONTEXT_PATH . "assets/img/pfp/");
            if ($bilan[1] == true) $user->set_image($bilan[0]);
            foreach ($bilan[2] as $erreur) array_push($messages, ["danger", $erreur]);
        }

        session_start();
        $_SESSION['user'] = $user;
        session_write_close();

        $tags = $daoTag->getTagsOfUser($user);
        $tagsTypes = [["primary", "Bleu"], ["secondary", "gris"], ["success", "vert"], ["danger", "rouge"], ["warning", "jaune"], ["info", "bleu clair"]];

        require_once "src/view/moncompte.php";
    }

    public function updateTag() {
        parse_str(file_get_contents("php://input"), $_UPDATE);
        $ajax   = [];
        $idTag  = $_UPDATE['tag'];
        if (isset($_UPDATE['type']))  $type   = $_UPDATE['type'];
        if (isset($_UPDATE['nom']))   $nom    = $_UPDATE['nom'];

        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $daoTag = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);
        $tag = $daoTag->getTagById($user, $idTag);
        if (isset($type))   $tag->set_type($type);
        if (isset($nom))    $tag->set_nom($nom);
        $daoTag->updateNomTag($tag);
        $daoTag->updateTypeTag($tag);

        $ajax['success'] = [TAG_UPDATE];

        echo json_encode($ajax);
    }

    public function deleteTag() {
        $ajax = [];
        parse_str(file_get_contents("php://input"), $_DELETE);
        $idTag = $_DELETE['tag'];

        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $daoTag = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);
        $tag = $daoTag->getTagById($user, $idTag);
        $daoTag->deleteTag($tag);

        $ajax['success'] = [TAG_DELETE];

        echo json_encode($ajax);
    }

    public function deletePlongee() {
        $ajax = [];
        parse_str(file_get_contents("php://input"), $_DELETE);
        $idPlongee = $_DELETE['plongee'];
        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $daoPlongee = new DaoPlongee(DBHOST, DBNAME, PORT, USER, PASS);
        $plongee = $daoPlongee->getPlongeeById($idPlongee, $user);
        $daoPlongee->deletePlongee($plongee);

        $ajax['success'] = [PLONGEE_SUPPRIMEE];

        echo json_encode($ajax);
    }

    public function getPageAmis($ajax) {
        $ajax['html'] = file_get_contents("src/view/mesamis.html");

        echo json_encode($ajax);
    }

    public function getModalAddAmi() {
        $ajax = [];
        $ajax['modal'] = file_get_contents("src/view/ajout-ami-modal.html");

        echo json_encode($ajax);
    }

    public function getAjoutAmi() {
        parse_str(file_get_contents("php://input"), $_PUT);
        $email = $_PUT['email'];
        $ajax = [];

        session_start();
        $follower = $_SESSION['user'];
        session_write_close();

        $daoFollow = new DaoFollow(DBHOST, DBNAME, PORT, USER, PASS);
        $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);

        $following = $daoUser->getUserByEMail($email);

        $followingList = $daoFollow->getFollowing($follower);

        
        if (!str_contains($email, '@') || !str_contains(explode('@', $email)[1], '.')) {
            $ajax['warning'] = [MAIL_INCORRECT];
        }
        elseif ($following == null) {
            $ajax['danger'] = [UTILISATEUR_NON_TROUVE];
        }
        elseif ($follower == $following) {
            $ajax['warning'] = [UTILISATEUR_IDENTIQUE];
        }
        elseif (in_array($following, $followingList)) {
            $ajax['info'] = [DEJA_AMI];
        }
        else {
            $daoFollow->addFollower($follower, $following);
            $ajax['success'] = [AMI_AJOUTE];

            session_start();
            $follower->add_following($following);
            $_SESSION['user'] = $follower;
            session_write_close();
        }

        echo json_encode($ajax);
    }

    public function deleteAmi() {
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'];

        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);
        $daoFollow = new DaoFollow(DBHOST, DBNAME, PORT, USER, PASS);

        $follow = $daoUser->getUserById($id);

        $daoFollow->deleteFollow($user, $follow);
    }

    public function getActualitesAmis() {
        $ajax = [];
        $ajax['actualites'] = [];

        session_start();
        if(isset($_SESSION['user'])){
            $user = $_SESSION['user'];
        }
        else $user=null;
        session_write_close();

        $daoPlongee = new DaoPlongee(DBHOST, DBNAME, PORT, USER, PASS);
        $daoFollow = new DaoFollow(DBHOST, DBNAME, PORT, USER, PASS);

        $user->set_following($daoFollow->getFollowing($user));

        foreach ($user->get_following() as $follow) {
            if ($follow->get_state() == 2) {
                $tmpPlongees = $daoPlongee->getPlongeesOfUser($follow);
                $plongees = [];
                foreach ($tmpPlongees as $plongee) {
                    $arrayPlongee = $plongee->toArray();
                    $arrayPlongee['user'] = $follow->toArray();
                    array_push($plongees, $arrayPlongee);
                }
                array_push($ajax['actualites'], $plongees);
            }
            elseif ($follow->get_state() == 1) {
                if ($daoFollow->checkFollowing($follow, $user)) {
                    $tmpPlongees = $daoPlongee->getPlongeesOfUser($follow);
                    $plongees = [];
                    foreach ($tmpPlongees as $plongee) {
                        $arrayPlongee = $plongee->toArray();
                        $arrayPlongee['user'] = $follow->toArray();
                        array_push($plongees, $arrayPlongee);
                    }
                    array_push($ajax['actualites'], $plongees);
                }
            }
        }
        
        echo json_encode($ajax);
    }

    public function getListeAmis() {
        $ajax = [];
        session_start();
        $user = $_SESSION['user'];
        session_write_close();

        $daoFollow = new DaoFollow(DBHOST, DBNAME, PORT, USER, PASS);
        $follows = $daoFollow->getFollowing($user);

        $ajax['follows'] = [];

        foreach ($follows as $follow) {
            array_push($ajax['follows'], $follow->toArray());
        }

        echo json_encode($ajax);
    }
}