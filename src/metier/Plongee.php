<?php 

class Plongee
{

    private float $profondeur;
    private float $duree;
    private float $bar_initial; 
    private float $volume_initial;
    private ?int $note;
    private string $description;

    public function __construct(float $profondeur,float $duree,float $bar_initial,float $volume_initial,int $note = NULL){
        $this->profondeur = $profondeur;
        $this->duree = $duree;
        $this->bar_initial = $bar_initial;
        $this->volume_initial = $volume_initial;
        $this->note = $note;
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