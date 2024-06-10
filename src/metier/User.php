<?php
class User {
    private ?int $id;
    private string $nom;
    private string $prenom;
    private string $email;
    private string $image;
    private int $state; // 0 -> Privé | 1 -> Reservé | 2 -> Publique
    private array $following;

    public function __construct(?int $id, string $nom, string $prenom, string $email, string $image, int $state = 0, array $following = []) {
        $this->id           = $id;
        $this->nom          = $nom;
        $this->prenom       = $prenom;
        $this->email        = $email;
        $this->image        = $image;
        $this->state        = $state;
        $this->following    = $following;
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

    public function get_state() : int {
        return $this->state;
    }

    public function get_following() : ?array {
        return $this->following;
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

    public function set_state(int $state) {
        $this->state = $state;
    }

    public function set_following(?array $following) {
        if ($following == null) $this->following = [];
        else                    $this->following = $following;
    }


    public function add_following(User $following) {
        array_push($this->following, $following);
    }

    public function toArray() {
        $result = [];
        $result['id']           = $this->get_id();
        $result['nom']          = $this->get_nom();
        $result['prenom']       = $this->get_prenom();
        $result['email']        = $this->get_email();
        $result['image']        = $this->get_image();
        $result['state']        = $this->get_state();
        $result['following']    = [];

        $followings = $this->get_following();
        foreach ($followings as $f) {
            array_push($result['following'], $f->toArray());
        }

        return $result;
    }
}