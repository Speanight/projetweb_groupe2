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

function displayPage(data) {
    let page = data['header'] + data['html'] + data['footer'];
    document.open();
    document.write(page);
    document.close();
}