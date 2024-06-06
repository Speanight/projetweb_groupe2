<?php
require_once "src/metier/User.php";

const DBHOST = "localhost";
const DBNAME = "plongisen";
const PORT = 5432;
const USER = "postgres";
const PASS = "Isen44N";

class Utils {
    public function connectUser(User $user) {
        session_start();
        $_SESSION['user'] = $user;
        session_write_close();
    }
}