<?php
require_once "src/dao/DaoTag.php";
require_once "src/metier/Plongee.php";
class DaoTagsPlongee {
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

    public function addTagToPlongee(Plongee $plongee, int $idTag) {
        $idPlongee = $plongee->get_id_plongee();

        $statement = $this->db->prepare("INSERT INTO tags_plongee (id_tag, id_plongee) VALUES (:tag, :plongee)");
        $statement->bindParam(":tag", $idTag);
        $statement->bindParam(":plongee", $idPlongee);
        $statement->execute();
    }

    public function getTagsOfPlongee(User $user, Plongee $plongee) {
        $id = $plongee->get_id_plongee();
        $statement = $this->db->prepare("SELECT * FROM tags_plongee WHERE id_plongee = :id");
        $statement->bindParam(":id", $id);
        $statement->execute();

        $daoTag = new DaoTag(DBHOST, DBNAME, PORT, USER, PASS);

        $tags = $statement->fetchAll();

        foreach ($tags as $tagRaw) {
            $plongee->add_tag($daoTag->getTagById($user, $tagRaw['id_tag']));
        }
        return $plongee;
    }
}