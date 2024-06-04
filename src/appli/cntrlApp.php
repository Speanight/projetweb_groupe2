<?php
class cntrlApp {
    public function getInitialAccueil() {
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
}