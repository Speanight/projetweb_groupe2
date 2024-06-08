<?php
class Follow {
    private ?int $id;
    private User $follower;
    private User $following;

    public function __construct(?int $id, User $follower, User $following) {
        $this->id           = $id;
        $this->follower     = $follower;
        $this->following    = $following;
    }
}