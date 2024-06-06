'use strict';

const tableau = document.getElementById('table_plonge');
let select = document.getElementById('profondeur');
const form = document.getElementById('form_p');
const value = document.getElementById('value');

let profondeur = 0;

ajaxRequest('GET','php/request.php/getPlongees/',remplireForm);

function remplireForm(donnee) {
    let size = Object.keys(donnee).length;
    for (let i = 0; i < size; i++) {
        select.options[select.options.length] = new Option(donnee[i]["profondeur"], donnee[i]["profondeur"]);
    }
}

form.addEventListener('change', function handleChange(event) {
    profondeur = event.target.value;
    ajaxRequest('GET','php/request.php/getPlongee/'+event.target.value,remplireTableau);
    
});


function remplireTableau(donnee) {
    document.getElementById('infos').innerHTML = '';
    clearTableau();
    if (profondeur != 'x') {
        let size = Object.keys(donnee).length;
        let data = "";
        for (let i = 0; i < size; i++) {
            data += '<tr>'
            data += '<td>' + decideNull(donnee[i]["prenom_user"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["nom_user"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["profondeur"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["duree"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["bar_initial"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["volume_initial"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["note"]) + '</td>';
            data += '<td>' + decideNull(donnee[i]["description"]) + '</td>';
            data += '</tr>';
        }
        tableau.innerHTML += data;
    }
    else {
        document.getElementById('infos').innerHTML = 'Veuillez entrer une profondeur valide.'
    }
}

function decideNull(donnee) {if (donnee) {return donnee;}return '-';}

function clearTableau() {
    tableau.innerHTML = '<tr><th>Prénom</th><th>Nom</th><th>Profondeur</th><th>Durée</th><th>Pression initiale</th><th>Volume initiale</th><th>Note</th><th>Description</th></tr>'
}