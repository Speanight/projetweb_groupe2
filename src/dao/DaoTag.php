<?php
require_once "src/metier/Tag.php";
class DaoTag {
    private string $host;
    private string $dbname;
    private int $port;
    private string $user;
    private string $pass;
    private PDO $db;
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

    public function addTag(Tag $tag) {
        $id     = $tag->get_id();
        $nom    = $tag->get_nom();
        $user   = $tag->get_user()->get_id();
        $type   = $tag->get_type();
        

        $statement = $this->db->prepare("INSERT INTO tag (nom_tag, id_user, type_tag) VALUES (:nom, :user, :type)");
        $statement->bindParam(":nom", $nom);
        $statement->bindParam(":user", $user);
        $statement->bindParam(":type", $type);

        
        try {
            $statement->execute();
            $tag->set_id($this->db->lastInsertId());
        }
        catch (PDOException $error) {
            switch ($error->getCode()) {
                case 23502:
                    return [ERREUR_GENERALE];
                default:
                    return [$error->getMessage()];
            }
        }

        return $tag;
    }

    // TODO: Récupérer tags généraux (MN90 notamment)
    public function getTagsOfUser(User $user) {
        $result     = [];
        $id_user    = $user->get_id();
        $statement  = $this->db->prepare("SELECT * FROM tag WHERE id_user = :user OR NULL");
        $statement->bindParam(":user", $id_user);
        $statement->execute();

        $tags = $statement->fetchAll();

        foreach ($tags as $t) {
            $tag = new Tag($t['id_tag'], $t['nom_tag'], $user, $t['type_tag']);
            array_push($result, $tag);
        }

        return $result;
    }

    public function getTagById(User $user, int $id) {
        $idUser = $user->get_id();
        $statement = $this->db->prepare("SELECT * FROM tag WHERE id_tag = :id");
        $statement->bindParam(":id", $id);
        $statement->execute();
        $tagRaw = $statement->fetch();

        $tag = new Tag($tagRaw['id_tag'], $tagRaw['nom_tag'], $user, $tagRaw['type_tag']);

        return $tag;
    }

    public function updateNomTag(Tag $tag) {
        $idUser = $tag->get_user()->get_id();
        $idTag  = $tag->get_id();
        $nom    = $tag->get_nom();
        $statement = $this->db->prepare("UPDATE public.tag SET nom_tag = :nom_tag WHERE id_tag = :tag AND id_user = :user");
        $statement->bindParam(":nom_tag", $nom);
        $statement->bindParam(":tag", $idTag);
        $statement->bindParam(":user", $idUser);
        $statement->execute();
    }

    public function updateTypeTag(Tag $tag) {
        $idUser = $tag->get_user()->get_id(); 
        $idTag  = $tag->get_id();
        $type   = $tag->get_type();
        $statement = $this->db->prepare("UPDATE public.tag SET type_tag = :typeTag WHERE id_tag = :tag AND id_user = :user");
        $statement->bindParam(":typeTag", $type);
        $statement->bindParam(":tag", $idTag);
        $statement->bindParam(":user", $idUser);
        $statement->execute();
    }

    public function deleteTag(Tag $tag) {
        $idTag = $tag->get_id();
        $idUser = $tag->get_user()->get_id();
        $statement = $this->db->prepare("DELETE FROM tags_plongee WHERE id_tag = :tag");
        $statement->bindParam(":tag", $idTag);
        $statement->execute();

        $statement = $this->db->prepare("DELETE FROM tag WHERE id_tag = :tag AND id_user = :user");
        $statement->bindParam(":tag", $idTag);
        $statement->bindParam(":user", $idUser);
        $statement->execute();
    }
}