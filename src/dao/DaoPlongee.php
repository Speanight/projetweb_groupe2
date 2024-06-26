<?php
require_once "src/metier/Plongee.php";
class DaoPlongee {
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

    public function addPlongee(Plongee $plongee, array $tags) {
        $profondeur     = $plongee->get_profondeur();
        $duree          = $plongee->get_duree();
        $bar_initial    = $plongee->get_bar_initial();
        $volume_initial = $plongee->get_volume_initial();
        $note           = $plongee->get_note();
        $description    = $plongee->get_description();
        $id_user        = $plongee->get_user()->get_id();
        $day            = $plongee->get_day();
        

        $statement = $this->db->prepare("INSERT INTO plongee (profondeur, duree, bar_initial, volume_initial, jour, note, description, id_user) VALUES (:profondeur, :duree, :bar, :volume, :jour, :note, :description, :user)");
        $statement->bindParam(":profondeur", $profondeur);
        $statement->bindParam(":duree", $duree);
        $statement->bindParam(":bar", $bar_initial);
        $statement->bindParam(":volume", $volume_initial);
        $statement->bindParam(":jour", $day);
        $statement->bindParam(":note", $note);
        $statement->bindParam(":description", $description);
        $statement->bindParam(":user", $id_user);

        
        try {
            $statement->execute();
            $plongee->set_id($this->db->lastInsertId());
        }
        catch (PDOException $error) {
            switch ($error->getCode()) {
                case 23505:
                    return [COMPTE_EXISTE_DEJA];
                case 23502:
                    return [CHAMPS_VIDES];
                default:
                    return [$error->getMessage()];
            }
        }

        return $plongee;
    }

    public function getPlongeesOfUser(User $user) {
        $result     = [];
        $id_user    = $user->get_id();
        $statement  = $this->db->prepare("SELECT * FROM plongee WHERE id_user = :user ORDER BY jour DESC");
        $statement->bindParam(":user", $id_user);
        $statement->execute();

        $plongees = $statement->fetchAll();

        foreach ($plongees as $pl) {
            $plongee = new Plongee($pl['id_plongee'], $pl['profondeur'], $pl['duree'], $pl['bar_initial'], $pl['volume_initial'], $pl['note'], $pl['jour'], $pl['description'], $user);
            array_push($result, $plongee);
        }

        return $result;
    }
    
    public function getPlongeeById(int $id, User $user) {
        $statement = $this->db->prepare("SELECT * FROM plongee WHERE id_plongee = :plongee");
        $statement->bindParam(":plongee", $id);
        $statement->execute();
        $pl = $statement->fetch();

        $plongee = new Plongee($pl['id_plongee'], $pl['profondeur'], $pl['duree'], $pl['bar_initial'], $pl['volume_initial'], $pl['note'], $pl['jour'], $pl['description'], $user);

        return $plongee;
    }

    public function deletePlongee(Plongee $plongee) {
        $idPlongee = $plongee->get_id_plongee();
        $idUser = $plongee->get_user()->get_id();

        $statement = $this->db->prepare("DELETE FROM plongee WHERE id_plongee = :plongee AND id_user = :user");
        $statement->bindParam(":plongee", $idPlongee);
        $statement->bindParam(":user", $idUser);
        $statement->execute();
    }

    public function getProfOfPlongee(){
        try
        {
          $request = 'SELECT DISTINCT profondeur FROM plongee ORDER BY profondeur';
          $statement = $this->db->prepare($request);
          $statement->execute();
          $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        }
        catch (PDOException $exception)
        {
          error_log('Request error: '.$exception->getMessage());
          return 'Request error: '.$exception->getMessage();
        }
        return $result;

    }

    public function getAllPlongee(){

        $DaoUser = new DaoUser(DBHOST, DBNAME, PORT, USER, PASS);
        $result     = [];
        $statement  = $this->db->prepare("SELECT DISTINCT * FROM plongee");


        $statement->execute();

        $plongees = $statement->fetchAll();

        foreach ($plongees as $pl) {
            $user = $DaoUser->getUserById($pl['id_user']);
            $plongee = new Plongee($pl['id_plongee'], $pl['profondeur'], $pl['duree'], $pl['bar_initial'], $pl['volume_initial'], $pl['note'], $pl['jour'], $pl['description'], $user);
            array_push($result, $plongee);
        }

        return $result;


    }

    public function updatePlongee(Plongee $plongee) {
        $id             = $plongee->get_id_plongee();
        $profondeur     = $plongee->get_profondeur();
        $duree          = $plongee->get_duree();
        $bar_initial    = $plongee->get_bar_initial();
        $volume_initial = $plongee->get_volume_initial();
        $note           = $plongee->get_note();
        $description    = $plongee->get_description();
        $day            = $plongee->get_day();

        $statement = $this->db->prepare("UPDATE plongee SET profondeur = :prof, duree = :duree, bar_initial = :bar, volume_initial = :volume, note = :note, description = :descr, jour = :jour WHERE id_plongee = :id");
        $statement->bindParam(":prof", $profondeur);
        $statement->bindParam(":duree", $duree);
        $statement->bindParam(":bar", $bar_initial);
        $statement->bindParam(":volume", $volume_initial);
        $statement->bindParam(":note", $note);
        $statement->bindParam(":descr", $description);
        $statement->bindParam(":jour", $day);
        $statement->bindParam(":id", $id);
        $statement->execute();
    }


}