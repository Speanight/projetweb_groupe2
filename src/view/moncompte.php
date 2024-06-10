<?php require_once "src/view/header.html" ?>
<script src="/assets/js/script.js" defer></script>
<script src="/assets/js/monprofil.js" defer></script>

<div class="row g-5">
    <div class="col-md-5 col-lg-4 order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Votre photo de profil</span>
      </h4>
      <form class="needs-validation" method="POST" action="/profil/update" enctype="multipart/form-data">
      <img class="user-image" src="assets/img/pfp/unknown.jpg" width="128px" />
      <hr class="mb-4">
      <div class="input-group">
        <input type="file" name="img" accept=".png,.jpg,.jpeg,.gif" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
      </div>
      <hr>
      <h4>Tags</h4>
      <div class="tags-list">
        <?php if (sizeof($tags) == 0): ?>
          <p>Vous n'avez encore crée aucun tag. Vous pouvez en créer en cliquant sur votre photo de profil et en allant dans "Mes plongées", puis dans "Ajouter une entrée".</p>
        <?php endif; ?>
        <?php foreach($tags as $tag): ?>
          <div class="input-group">
            <input type="text" class="form-control" id="nomTag-<?=$tag->get_id()?>" placeholder="Nom du tag" value="<?=$tag->get_nom()?>">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Couleur</button>
            <ul class="dropdown-menu dropdown-menu-end">
              <?php foreach ($tagsTypes as $type): ?>
                <li><a class="dropdown-item bg-<?=$type[0]?>-subtle tagColor" id="tagColor-<?=$type[0]?>-<?=$tag->get_id()?>"><?=$type[1]?></a></li>
              <?php endforeach; ?>
            </ul>
            <button class="btn btn-outline-secondary btn-warning editTag" id="editTag-<?=$tag->get_id()?>" type="button"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-outline-secondary btn-danger deleteTag" id="deleteTag-<?=$tag->get_id()?>" type="button" onclick="deleteTag(this)"><i class="bi bi-trash-fill"></i></button>
        </div>
        <?php endforeach; ?>
      </div>

    </div>
    <div class="col-md-7 col-lg-8">
      <h4 class="mb-3">Informations personnelles</h4>
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="prenom" class="form-label">Prénom</label>
            <input type="text" class="form-control" id="prenom" name="prenom" placeholder="Jean" value="<?=$user->get_prenom()?>" />
          </div>

          <div class="col-sm-6">
            <label for="nom" class="form-label">Nom</label>
            <input type="text" class="form-control" id="nom" name="nom" placeholder="Jacques" value="<?=$user->get_nom()?>" />
          </div>
          
        <h4 class="mb-3">Détails du compte</h4>

          <div class="col-12">
            <label for="email" class="form-label">E-mail</label>
            <div class="input-group has-validation">
              <span class="input-group-text">@</span>
              <input type="email" class="form-control" id="email" name="email" placeholder="example@domain.com" value="<?=$user->get_email()?>">
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
            <input id="public" name="publicity" type="radio" class="form-check-input" value="0">
            <label class="form-check-label" for="private">Privé</label>
          </div>
          <div class="form-check">
            <input id="reserved" name="publicity" type="radio" class="form-check-input" value="1">
            <label class="form-check-label" for="reserved">Réservé (amis uniquement)</label>
          </div>
          <div class="form-check">
            <input id="private" name="publicity" type="radio" class="form-check-input" value="2">
            <label class="form-check-label" for="public">Publique</label>
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
  <div id="message-wrapper">
    <?php foreach ($messages as $msg) { ?>
        <div class="alert alert-<?=$msg[0]?> d-flex align-items-center" role="alert">
        <?php if ($msg[0] == "success"): ?> <i class="bi bi-check-circle-fill"></i> <?php endif; ?>
        <?php if ($msg[0] == "warning"): ?> <i class="bi bi-exclamation-circle-fill"></i> <?php endif; ?>
        <?php if ($msg[0] == "danger"): ?> <i class="bi bi-x-octagon-fill"></i> <?php endif; ?>
        <?php if ($msg[0] == "info"): ?> <i class="bi bi-info-circle-fill"></i> <?php endif; ?>
        <div><?=$msg[1]?></div>
        <button type="button" class="btn-close btn-close-messages" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    <?php } ?>
  </div>
<?php
require_once "src/view/footer.html";
?>