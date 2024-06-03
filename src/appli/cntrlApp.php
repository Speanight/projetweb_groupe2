<?php
class cntrlApp {
    public function getAccueil() {

        require_once "src/view/header.html";
        require_once "src/view/accueil.html";
        require_once "src/view/footer.html";
    }
}