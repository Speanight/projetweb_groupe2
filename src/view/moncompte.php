<?php
require_once "src/view/header.html";
?>

<script src="assets/js/monprofil.js" defer></script>
<div class="row g-5">
    <div class="col-md-5 col-lg-4 order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Votre photo de profil</span>
      </h4>
      <img class="user-image" src="assets/img/pfp/unknown.jpg" width="128px" />
      <hr>
      <div class="input-group">
        <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
      </div>
    </div>
    <div class="col-md-7 col-lg-8">
      <h4 class="mb-3">Informations personnelles</h4>
      <form class="needs-validation" method="POST" action="/profil/update">
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="prenom" class="form-label">Prénom</label>
            <input type="text" class="form-control" id="prenom" name="prenom" placeholder="Jean" />
          </div>

          <div class="col-sm-6">
            <label for="nom" class="form-label">Nom</label>
            <input type="text" class="form-control" id="nom" name="nom" placeholder="Jacques" />
          </div>
          
        <h4 class="mb-3">Détails du compte</h4>

          <div class="col-12">
            <label for="email" class="form-label">E-mail</label>
            <div class="input-group has-validation">
              <span class="input-group-text">@</span>
              <input type="email" class="form-control" id="email" name="email" placeholder="example@domain.com">
            </div>
          </div>

          <div class="col-12">
            <label for="newPassword" class="form-label">Nouveau mot de passe</label>
            <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="******">
          </div>

          <div class="col-12">
            <label for="newPasswordVerify" class="form-label">Nouveau mot de passe (vérification)</label>
            <input type="password" class="form-control" id="newPasswordVerify" name="newPasswordVerify" placeholder="******">
          </div>

        <hr class="my-4">

        <h5 class="mb-3">Etat du compte</h5>

        <div class="my-3">
          <div class="form-check">
            <input id="public" name="publicity" type="radio" class="form-check-input" value="2">
            <label class="form-check-label" for="public">Publique</label>
          </div>
          <div class="form-check">
            <input id="reserved" name="publicity" type="radio" class="form-check-input" value="1">
            <label class="form-check-label" for="reserved">Réservé (amis uniquement)</label>
          </div>
          <div class="form-check">
            <input id="private" name="publicity" type="radio" class="form-check-input" value="0">
            <label class="form-check-label" for="private">Privé</label>
          </div>
        </div>

        </div>

        <hr class="my-4">

        

        <div class="col-12">
            <label for="password" class="form-label">Mot de passe actuel</label>
            <input type="password" class="form-control" id="password" name="password">
          </div>

          <hr>

        <button class="w-100 btn btn-primary btn-lg" id="editCompte">Confirmer</button>
      </form>
    </div>
  </div>
  <div id="php-message-wrapper">
    <?php foreach ($messages as $category => $msg) { ?>
        <div class="alert alert-<?=$category?> d-flex align-items-center" role="alert">`
        if (msgType == "success") inner += `<i class="bi bi-check-circle-fill"></i>`; 
        if (msgType == "warning") inner += `<i class="bi bi-exclamation-circle-fill"></i>`; 
        if (msgType == "danger") inner += `<i class="bi bi-x-octagon-fill"></i>`;
        if (msgType == "info") inner += `<i class="bi bi-info-circle-fill"></i>`;
        inner += `<div>
        ${data[msgType][j]}
        </div>
        <button type="button" class="btn-close btn-close-messages" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    <?php } ?>
  </div>
<?php
require_once "src/view/footer.html";
?>