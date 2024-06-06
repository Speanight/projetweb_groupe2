<?php 
require_once "src/metier/User.php";
class Plongee
{

    private ?int $id_plongee;
    private float $profondeur;
    private float $duree;
    private float $bar_initial; 
    private float $volume_initial;
    private int $note;
    private string $day;
    private string $description;
    private User $user;

    public function __construct(?int $id_plongee,float $profondeur,float $duree,float $bar_initial,float $volume_initial,int $note, string $day, string $description, User $user){
        $this->id_plongee = $id_plongee;
        $this->profondeur = $profondeur;
        $this->duree = $duree;
        $this->bar_initial = $bar_initial;
        $this->volume_initial = $volume_initial;
        $this->note = $note;
        $this->day = $day;
        $this->description = $description;
        $this->user = $user;
    }


    //GETTERS

    public function get_profondeur() : float{
        return $this->profondeur;
    }
    public function get_duree() : float{
        return $this->duree;
    }
    public function get_bar_initial() : float{
        return $this->bar_initial;
    }
    public function get_volume_initial() : int{
        return $this->volume_initial;
    }
    public function get_note() : string{
        return $this->note;
    }

    public function get_day() : string {
        return $this->day;
    }

    public function get_description() : string {
        return $this->description;
    }

    public function get_user() : User {
        return $this->user;
    }

    public function set_id(int $id) {
        $this->id_plongee = $id;
    }

    // Methods
    public function toArray() {
        $plongee = [];
        $plongee['id'] = $this->get_id_plongee();
        $plongee['profondeur'] = $this->get_profondeur();
        $plongee['duree'] = $this->get_duree();
        $plongee['bar_initial'] = $this->get_bar_initial();
        $plongee['volume_initial'] = $this->get_volume_initial();
        $plongee['note'] = $this->get_note();
        $plongee['description'] = $this->get_description();

        return $plongee;
    }
    //SETTERS

    public function set_profondeur(float $profondeur){
        return $this->profondeur;
    }
    public function set_duree(float $duree){
        return $this->duree;
    }
    public function set_bar_initial(float $bar_initial){
        return $this->bar_initial;
    }
    public function set_volume_initial(int $volume_initial){
        return $this->volume_initial;
    }
    public function set_note(string $note){
        return $this->note;
    }


}