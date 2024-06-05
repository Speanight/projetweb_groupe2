<?php 

class Plongee
{

    private int $id_plongee;
    private float $profondeur;
    private float $duree;
    private float $bar_initial; 
    private float $volume_initial;
    private int $note;
    private string $description;

    public function __construct(int $id_plongee,float $profondeur,float $duree,float $bar_initial,float $volume_initial,int $note){
        $this->$id_plongee = $id_plongee;
        $this->$profondeur = $profondeur;
        $this->$duree = $duree;
        $this->$bar_initial = $bar_initial;
        $this->$volume_initial = $volume_initial;
        $this->$note = $note;
    }


    public function get_id_plongee() : int{
        return $this->id_plongee;
    }
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



}