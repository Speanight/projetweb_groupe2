<?php
require_once "src/metier/User.php";
require_once "src/dao/DaoUser.php";
class DaoFollow {
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

    public function addFollower(User $follower, User $following) {
        $idFollower     = $follower->get_id();
        $idFollowing    = $following->get_id();
        $statement = $this->db->prepare("INSERT INTO follow (id_follower, id_following) VALUES (:follower, :following)");
        $statement->bindParam(":follower", $idFollower);
        $statement->bindParam(":following", $idFollowing);
        $statement->execute();

        return $following;
    }

    public function getFollowing(User $follower) {
        $id = $follower->get_id();
        $statement = $this->db->prepare("SELECT * FROM follow WHERE id_follower = :id");
        $statement->bindParam(":id", $id);
        $statement->execute();
        $tmpFollowings = $statement->fetchAll();

        $daoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);

        $followings = [];

        foreach ($tmpFollowings as $tmpF) {
            $following = $daoUser->getUserById($tmpF['id_following']);
            array_push($followings, $following);
        }

        return $followings;
    }

    public function deleteFollow(User $follower, User $following) {
        $idFollower = $follower->get_id();
        $idFollowing = $following->get_id();

        $statement = $this->db->prepare("DELETE FROM follow WHERE id_follower = :follower AND id_following = :following");
        $statement->bindParam(":follower", $idFollower);
        $statement->bindParam(":following", $idFollowing);
        $statement->execute();

        return true;
    }

    public function checkFollowing(User $follower, User $following) {
        $idFollower = $follower->get_id();
        $idFollowing = $following->get_id();

        $statement = $this->db->prepare("SELECT * FROM follow WHERE id_follower = :follower AND id_following = :following");
        $statement->bindParam(":follower", $idFollower);
        $statement->bindParam(":following", $idFollowing);
        $statement->execute();

        if (sizeof($statement->fetchAll()) == 1) {
            return true;
        }
        return false;
    }
}