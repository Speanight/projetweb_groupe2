<?php 


require_once "src/metier/MN90.php";


class DaoMN90
{

    private string $host;
    private string $dbname;
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

    public function getMn90OfPlongee(Plongee $plongee){
        $profondeur = $plongee->get_profondeur();
        $duree = $plongee->get_duree();

        $statement = $this->db->prepare("SELECT profondeur_palier,duree_dp,palier3m,palier6m,palier9m,palier12m,palier15m FROM mn90
        WHERE profondeur_palier = :profondeur_palier AND duree_dp = :duree_dp;");
        $statement->bindParam(":profondeur_palier",$profondeur);
        $statement->bindParam(":duree_dp",$duree);

        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if($result == false) $mn90 = null;
        else $mn90 = new MN90($result['profondeur_palier'],$result['duree_dp'],$result['palier3m'],$result['palier6m'],$result['palier9m'],$result['palier12m'],$result['palier15m']);

        return $mn90;
    }

    public function getDureeWithProfondeur($profondeur){

        $statement = $this->db->prepare("SELECT duree_dp FROM mn90 WHERE profondeur_palier=:profondeur_palier;");
        $statement->bindParam(":profondeur_palier",$profondeur);

        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        if($result == false) $duree = null;
        else $duree = $result;
        
        return $duree;

    }
    
    public function getIfExistsFromDureeEtProfondeur(int $duree, int $profondeur) {
        $statement = $this->db->prepare("SELECT * FROM mn90 WHERE profondeur_palier = :profondeur AND duree_dp = :duree");
        $statement->bindParam(":profondeur", $profondeur);
        $statement->bindParam(":duree", $duree);
        $statement->execute();

        $result = $statement->fetch();

        return $result != null;
    }

    public function getProfOfMN90(){
        try
        {
          $request = 'SELECT DISTINCT profondeur_palier FROM mn90 ORDER BY profondeur_palier';
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

    public function getPlongeesOfMN90($profondeur){


        $statement = $this->db->prepare("SELECT * FROM mn90 WHERE profondeur_palier=:profondeur_palier;");
        $statement->bindParam(":profondeur_palier",$profondeur);

        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        if($result == false) $mn90 = null;
        else $mn90 = $result;

        return $mn90;



    }


}