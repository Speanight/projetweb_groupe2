<?php 

class MN90{
    private ?int $profondeur_palier;
    private ?int $duree_dp;
    private ?int $palier3m;
    private ?int $palier6m;
    private ?int $palier9m;
    private ?int $palier12m;
    private ?int $palier15m;

    public function __construct(?int $profondeur_palier,?int $duree_dp,?int $palier3m,?int $palier6m,?int $palier9m,?int $palier12m,?int $palier15m){

        $this->profondeur_palier = $profondeur_palier;
        $this->duree_dp = $duree_dp;
        $this->palier3m = $palier3m;
        $this->palier6m = $palier6m;
        $this->palier9m = $palier9m;
        $this->palier12m = $palier12m;
        $this->palier15m = $palier15m;


    }

    //GETTERS

    public function getPaliers(){
        return [[15,$this->palier15m],[12,$this->palier12m],[9,$this->palier9m],[6,$this->palier6m],[3,$this->palier3m]];
    }   
    
    public function getProfondeur() : int {
        return $this->profondeur_palier;
    }

    public function getDuree() : int {
        return $this->duree_dp;
    }


}


?>