<?php
require_once "src/metier/User.php";
require_once "src/view/Messages.php";

const DBHOST = "localhost";
const DBNAME = "plongisen";
const PORT = 5432;
const USER = "postgres";
const PASS = "Isen44N";

const CONTEXT_PATH = "/var/www/html/projetCIR2/";

class Utils {
    public function connectUser(User $user) {
        session_start();
        $_SESSION['user'] = $user;
        session_write_close();
    }

    /**
     * Fonction permettant de sauvegarder une image. La fonction demande 3 arguments :
     * - $pictureName, le nom de l'image quand elle sera sauvegardée.
     * - $inputName, le nom de l'input qui contient le fichier sur la page HTML.
     * - $targetDir, le directoire où enregistrer l'image.
     * 
     * La fonction va tenter d'enregistrer l'image et gèrera les erreurs s'il y en a. Elle renvoie un tableau de différentes valeurs :
     * - $bilan[0] contient le nom de l'image et son extension si elle a bien été enregistrée.
     * - $bilan[1] contient true si l'image a pu être enregistrée, sinon elle contient false.
     * - $bilan[2] contient les erreurs ayant empêchés le bon déroulement de la fonction (souvent côté utilisateur)
     * - $bilan[3] contient les warnings ayant empêches le bon déroulement de la fonction (souvent côté serveur) 
     */
    public function savePicture($pictureName, $inputName, $targetDir) {
        $bilan      = [];
        $erreurs    = [];
        $warnings   = [];
        $image      = "";

        if ($_FILES[$inputName]["name"] != "") {
            $target_no_extension    = $targetDir . $pictureName;
            $target_file            = $targetDir . $pictureName . "." . pathinfo($_FILES[$inputName]["name"], PATHINFO_EXTENSION);
            $boolUpload             = true;

            if (file_exists($target_no_extension . ".png")) {
                if (!unlink($target_no_extension . ".png")) {
                    $boolUpload = false;
                    array_push($erreurs, OLD_PHOTO_NON_SUPPRIMEE);
                }
            }
            
            if (file_exists($target_no_extension . ".jpg")) {
                if (!unlink($target_no_extension . ".jpg")) {
                    $boolUpload = false;
                    array_push($erreurs, OLD_PHOTO_NON_SUPPRIMEE);
                }
            }
            
            if (file_exists($target_no_extension . ".jpeg")) {
                if (!unlink($target_no_extension . ".jpeg")) {
                    $boolUpload = false;
                    array_push($erreurs, OLD_PHOTO_NON_SUPPRIMEE);
                }
            }

            $check = getimagesize($_FILES[$inputName]["tmp_name"]);
            if ($check === false) {
                array_push($erreurs, PHOTO_INCORRECTE);
                $boolUpload = false;
            }

            if ($_FILES[$inputName]["size"] > 5000000) {
                array_push($erreurs, PHOTO_LOURDE);
                $boolUpload = false;
            }

            if ($boolUpload) {
                if (move_uploaded_file($_FILES[$inputName]["tmp_name"], $target_file)) {
                    $image = $pictureName . "." . pathinfo($_FILES[$inputName]["name"], PATHINFO_EXTENSION);
                }
                else {
                    array_push($warnings, PHOTO_NON_UPLOAD);
                }
            }
        }
        else    $boolUpload = false;


        array_push($bilan, $image);
        array_push($bilan, $boolUpload);
        array_push($bilan, $erreurs);
        array_push($bilan, $warnings);

        return $bilan;
    }
}