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

    displayMessages(data);
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
  const typeMessages = ["alert", "success", "warning", "danger"];
  for (let i = 0; i < typeMessages.length; i++) {
    let msgType = typeMessages[i];
    if (typeMessages[i] in data) {
      console.log(msgType);
      console.log(data[msgType]);
      for (let j = 0; j < data[msgType].length; j++) {
        messageWrapper.innerHTML += `<div class="alert alert-${msgType} d-flex align-items-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <div>
        ${data[msgType][j]}
        </div>
        <button type="button" class="btn-close btn-close-messages" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
      }
    }
  }
  const closeButtons = document.getElementsByClassName("btn-close-messages");
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", () => {
      closeButtons[i].parentNode.remove();
    })
  }
}