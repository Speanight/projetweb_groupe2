/**
 * Fonction permettant de faire des requêtes AJAX au routeur PHP.
 * 
 * @param {string} type correspond au type de requête (GET, POST, PUT, DELETE, ...)
 * @param {string} url correspond à l'URL de la requête
 * @param {function} callback correspond à la fonction à appeler et à qui envoyer les données
 * @param {string} data correspond aux données à envoyer au PHP, dans le tableau $_GET, $_POST, ...
 */
function ajaxRequest(type, url, callback, data = null) {
  let xhr;
  console.log(url + "?" + data);

  // On crée la requête xml http
  xhr = new XMLHttpRequest();
  if (type == 'GET' && data != null)
    url += '?' + data;
  xhr.open(type, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.setRequestHeader('Pragma', 'no-cache');

  // On ajoute la fonction quand le xhr est chargé
  xhr.onload = () => {
    switch (xhr.status)
    {
      case 200:
      case 201:
        console.log(xhr.responseText);
        console.log(JSON.parse(xhr.responseText));
        callback(JSON.parse(xhr.responseText));
        displayMessages(JSON.parse(xhr.responseText));
        break;
      default:
        httpErrors(xhr.status);
    }
  };

  // On envoie la requête http xhr.
  xhr.send(data);
}

/**
 * Fonction permettant l'affichage de la page, supprimant l'entièreté de ce qui a été affiché avant pour ensuite rajouter la nouvelle page.
 * @param {Array} data correspond aux données de la page. doit avoir du contenu html en position 'header', 'html' et 'footer'.
 */
function displayPage(data) {
    let page = data['header'] + data['html'] + data['footer'];
    document.open();
    document.write(page);
    document.close();

    addEventListener("DOMContentLoaded", () => {
      displayPageAdaptedForUser(data);
    });
}

/** Fonction ajoutant de l'HTML dans une page dans un élément à ID donné.
 * 
 * @param {Array} data Contenu à ajouter dans la modal. Les données à ajouter doivent être contenus dans une key du tableau avec le nom de l'ID.
 * @param {string} place ID de l'élément où ajouter le contenu.
 */
function appendToPage(data, place) {
  let elem = document.getElementById(place);
  elem.innerHTML = data[place];
}

function showModal(data) {
  let elem = document.getElementById("modal");
  elem.innerHTML = data['modal'];
  
  let buttonClose = document.getElementById("closeModal");
  buttonClose.addEventListener("click", () => {
      elem.classList = "modal hidden Tmodal";
      elem.innerHTML = "";
  });
}

/**
 * Fonction inversant chaque nombre par indice, les positifs devenant alors des négatifs et inversement.
 * @param {Array} array Liste de nombres
 * @returns La même liste que celle passée en argument, mais avec leurs signes inversés.
 */
function invertNumbersInArray(array) {
  let newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push(-array[i]);
  }
  return newArray;
}

/** Fonction affichant un message d'erreur en bas de l'écran avant de le faire disparaître après 5 secondes, pour avertir l'utilisateur du résultat d'une requête.
 * 
 * @param {Array} data Données renvoyées par ajaxRequest. Doit contenir 'success', 'warning', 'danger' ou 'info'.
 */
function displayMessages(data) {
  const messageWrapper = document.getElementById("message-wrapper");
  const typeMessages = ["success", "warning", "danger", "info"];
  var msgId = 0;
  for (let i = 0; i < typeMessages.length; i++) {
    if (typeMessages[i] in data) {
      let msgType = typeMessages[i];
      for (let j = 0; j < data[msgType].length; j++) {
        var inner = `<div class="alert alert-${msgType} d-flex align-items-center" id="alert-${msgId}" role="alert">`
        if (msgType == "success") inner += `<i class="bi bi-check-circle-fill"></i>`; 
        if (msgType == "warning") inner += `<i class="bi bi-exclamation-circle-fill"></i>`; 
        if (msgType == "danger") inner += `<i class="bi bi-x-octagon-fill"></i>`;
        if (msgType == "info") inner += `<i class="bi bi-info-circle-fill"></i>`;
        inner += `<div>
        ${data[msgType][j]}
        </div>
        <button type="button" class="btn-close btn-close-messages" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    messageWrapper.innerHTML += inner;
      }
    }
  }
  const closeButtons = document.getElementsByClassName("btn-close-messages");
  // TODO: Fix fermeture par alertes (ne fonctionne pas si nombreuses).
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", function(event) {
      event.parentNode.remove();
    })
    setTimeout(function() {if (closeButtons[i] !== undefined) {closeButtons[i].parentNode.remove();}}, 5000);
  }
}

/** Fonction permettant de masquer les parties du site que l'utilisateur n'est pas censé obtenir, selon s'il est connecté ou non.
 * 
 * @param {Array} data Données renvoyées par la fonction ajaxRequest. Doit contenir 'user'.
 */
function displayPageAdaptedForUser(data) {
  if ("user" in data) {
    if (data["user"] != null) {
      $(".user-not-connected").hide();
      $(".user-connected").show();
      $(".user-image").attr("src", "/assets/img/pfp/" + data.user.image);
    }
    else {
      $(".user-not-connected").show();
      $(".user-connected").hide();
    }
  }
}

/**
 * Fonction qui filtre les sous-tableaux contenant null
 * @param {Array} array Tableau à filtrer
 * @returns {Array} Nouveau tableau sans les sous-tableaux contenant null
 */

function convertArrayIfNull(array) {
  return array.filter(subArray => !subArray.includes(null));
}

function additionNumberWithPreviousInArray(array){
  let size_array = array.length;

  let new_array = [];

  new_array.push(array[0]);

  for(let i=1; i<size_array;i++){
    new_array.push(parseFloat((new_array[i-1] + array[i]).toFixed(1)));
  }
  
  return new_array;
  
}

function additionNumbersInArray(array){
  let result = 0;
  for(let i=0;i<array.length;i++){
    result += array[i];
  }

  return result;
}

function getActualiesAmis(data) {
  const elem = document.getElementById("actualites");
  if (elem == null) {
    return;
  }
  var text = "";
  for (let i = 0; i < data['actualites'][0].length; i++) {
      console.log(data['actualites'][0][i]);
      var plongee = data['actualites'][0][i];
      var note = "";
      for (let i = 0; i < plongee.note; i++) {
          note += "★";
      }
      var description = plongee.description;
      if (description == "") {
          description = "Cet utilisateur n'a pas ajouté de description";
      }
      text += `
      <div href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
    <img src="/assets/img/pfp/${plongee.user.image}" alt="pfp" width="32" height="32" class="rounded-circle flex-shrink-0">
    <div class="d-flex gap-2 w-100 justify-content-between">
      <div>
        <h6 class="mb-0">Plongée de ${plongee.duree} minutes jusqu'à ${plongee.profondeur}m de profondeur - ${note}</h6>
        <p class="mb-0 opacity-75">${description}.</p>
      </div>
      <small class="opacity-50 text-nowrap">${plongee.day}</small>
    </div>
  </div>
      `
  }
  elem.innerHTML = text;
}