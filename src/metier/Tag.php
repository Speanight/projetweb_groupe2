<?php
class Tag {
    private ?int $id;
    private string $nom;
    // TODO: fix erreur page entrées
    private ?User $user;
    private string $type;

    public function __construct(?int $id, string $nom, ?User $user, string $type) {
        $this->id = $id;
        $this->nom = $nom;
        $this->user = $user;
        $this->type = $type;
    }

    public function get_id() : ?int {
        return $this->id;
    }

    public function get_nom() : string {
        return $this->nom;
    }

    public function get_user() : ?User {
        return $this->user;
    }

    public function get_type() : string {
        return $this->type;
    }

    public function set_id(int $id) {
        $this->id = $id;
    }

    public function toArray() {
        $result = [];
        $result['id']   = $this->id;
        $result['nom']  = $this->nom;
        $result['user'] = $this->user;
        $result['type'] = $this->type;

        return $result;
    }
}