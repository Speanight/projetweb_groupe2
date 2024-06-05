<?php
require_once "src/metier/User.php";

class DaoUser {
    public function __construct(string $host, string $dbname, int $port, string $user, string $pass){
        $this->host = $host;
        $this->dbname = $dbname;
        $this->user = $user;
        $this->pass = $pass;

        try {
            $this->db = new PDO("pgsql:dbname=" . $dbname . ";host=" . $host . ";port=" . $port, $user, $pass);
        } catch (PDOException $e) {
            $erreurs = [];
            echo $e->getMessage();
        }
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function getUserById(int $id) : ?User {
        $statement = $this->db->prepare("SELECT * FROM public.user WHERE id_user = :id");
        $statement->bindParam(":id", $id);
        $statement->execute();
        $tmpUser = $statement->fetch();

        if ($tmpUser == false)  $user = null;
        else                    $user = new User($tmpUser['id_user'], $tmpUser['nom_user'], $tmpUser['prenom_user'], $tmpUser['email_user'], $tmpUser['image_user']);

        return $user;
    }

    public function getUserConnection(string $mail, string $password) {
        $user = null;

        $statement = $this->db->prepare("SELECT * FROM public.user WHERE email_user = :email");
        $statement->bindParam(":email", $mail);
        $statement->execute();
        $tmpUser = $statement->fetch();

        if ($tmpUser != false) {
            if (password_verify($password, $tmpUser['password_user'])) {
                $user = $this->getUserById($tmpUser['id_user']);
            }
        }

        return $user;
    }

    public function getUserInscription(User $user, string $password) {
        $prenom = $user->get_prenom();
        $nom    = $user->get_nom();
        $email  = $user->get_email();
        $image  = $user->get_image();

        $statement = $this->db->prepare("INSERT INTO public.user (prenom_user, nom_user, email_user, password_user, image_user) VALUES (:prenom, :nom, :email, :pass, :image)");
        $statement->bindParam(":prenom", $prenom);
        $statement->bindParam(":nom", $nom);
        $statement->bindParam(":email", $email);
        $statement->bindParam(":pass", $password);
        $statement->bindParam(":image", $image);

        try {
            $statement->execute();
            $user->set_id($this->db->lastInsertId());
        }
        catch (PDOException $error) {
            switch ($error->getCode()) {
                case 23505:
                    return [COMPTE_EXISTE_DEJA];
                default:
                    return [$error->getMessage()];
            }
        }

        return $user;
    }
}