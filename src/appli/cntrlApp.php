<?php
class cntrlApp {
    public function getInitialAccueil() {
        // TODO: Autre page pour la première page, qui dépend de si l'utilisateur est connecté ou non.
        $page = "";
        $page .= file_get_contents("src/view/header.html");
        $page .= file_get_contents("src/view/accueil.html");
        $page .= file_get_contents("src/view/footer.html");

        print_r($page);
    }

    public function getAccueil($ajax) {
        $ajax['html'] = file_get_contents("src/view/accueil.html");

        echo json_encode($ajax);
    }

    public function getRecherche($ajax) {
        $ajax['html'] = file_get_contents("src/view/recherche.html");

        echo json_encode($ajax);
    }

    public function getRechercheTable($ajax) {
        $ajax['html'] = file_get_contents("src/view/table.html");

        echo json_encode($ajax);
    }

    public function getModalConnexion() {
        $ajax['connexion'] = file_get_contents("src/view/connexion-modal.html");

        echo json_encode($ajax);
    }

    public function getModalInscription() {
        $ajax['connexion'] = file_get_contents("src/view/inscription-modal.html");

        echo json_encode($ajax);
    }

    public function getMesPlongees($ajax) {
        if ($ajax['user'] == null) {
            $this->getAccueil($ajax);
        }
        else {
            $ajax['html'] = file_get_contents("src/view/mesplongees.html");

            echo json_encode($ajax);
        }
    }

    public function getModalPlongees() {
        $ajax = [];

        $ajax['modal'] = file_get_contents("src/view/plongees-modal.html");
        echo json_encode($ajax);
    }

    public function getFormParam($ajax){
        $ajax['html'] = file_get_contents("src/view/view-param.html");

        echo json_encode($ajax);

    }
    




}