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