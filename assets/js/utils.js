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
    })
}

// TODO: Description fonction
function appendToPage(data, place) {
  let elem = document.getElementById(place);
  elem.innerHTML = data[place];
}

/**
 * Fonction inversant chaque nombre par indice, les positifs devenant alors des négatifs et inversement.
 * @param {Array} array Liste de nombres
 * @returns La même liste que celle passée en argument, mais avec leurs signes inversés.
 */
function invertNumbersInArray(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = -array[i];
  }
  return array;
}

function displayMessages(data) {
  const messageWrapper = document.getElementById("message-wrapper");
  const typeMessages = ["success", "warning", "danger", "info"];
  for (let i = 0; i < typeMessages.length; i++) {
    if (typeMessages[i] in data) {
      let msgType = typeMessages[i];
      for (let j = 0; j < data[msgType].length; j++) {
        var inner = `<div class="alert alert-${msgType} d-flex align-items-center" role="alert">`
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
    closeButtons[i].addEventListener("click", () => {
      closeButtons[i].parentNode.remove();
    })
    setTimeout(function() {closeButtons[i].parentNode.remove();}, 4000);
  }
}

function displayPageAdaptedForUser(data) {
  if ("user" in data) {
    if (data["user"] != null) {
      $(".user-not-connected").hide();
      $(".user-connected").show();
      $(".user-image").attr("src", "assets/img/pfp/" + data.user.image);
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

