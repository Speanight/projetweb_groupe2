<?php
class User {
    public function __construct(?int $id, string $nom, string $prenom, string $email, string $image) {
        $this->id       = $id;
        $this->nom      = $nom;
        $this->prenom   = $prenom;
        $this->email    = $email;
        $this->image    = $image;
    }

    // GETTERS
    public function get_id() : ?int {
        return $this->id;
    }

    public function get_nom() : string {
        return $this->nom;
    }

    public function get_prenom() : string {
        return $this->prenom;
    }

    public function get_email() : string {
        return $this->email;
    }

    public function get_image() : string {
        return $this->image;
    }

    // SETTERS
    public function set_id(int $id) {
        $this->id = $id;
    }

    public function set_nom(string $nom) {
        $this->nom = $nom;
    }

    public function set_prenom(string $prenom) {
        $this->prenom = $prenom;
    }

    public function set_email(string $email) {
        $this->email = $email;
    }

    public function set_image(string $image) {
        $this->image = $image;
    }
}