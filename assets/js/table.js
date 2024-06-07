'use strict';

let select = document.getElementById('profondeur');
const form = document.getElementById('form_p');
const tableau = document.getElementById('table_plonge');
const value = document.getElementById('value');

let profondeur = 0;

ajaxRequest('GET','php/request.php/getProf/',remplireForm);

/**
 * Fonction permettant de remplir le formulaire de select avec la profondeur de toutes les plongées qui ont été effectué.
 * @param {Array} donnee Tableau de dictionnaire
 */
function remplireForm(donnee) {
    let size = Object.keys(donnee).length;
    console.log(size);
    for (let i = 0; i < size-1; i++) {
        select.options[select.options.length] = new Option(donnee[i]["prof"] + 'm', donnee[i]["prof"]);
    }
}

form.addEventListener('change', function handleChange(event) {
    profondeur = event.target.value;
    console.log(profondeur);
    ajaxRequest('GET','php/request.php/dbGetTable/'+event.target.value,remplireTableau);
    
});

/**
 * Fonction permettant de remplir le tableau des valeurs que la requète ajax renverra.
 * @param {Array} donnee Tableau de dictionnaire
 */
function remplireTableau(donnee) {
    document.getElementById('infos').innerHTML = '';
    clearTableau();
    if (profondeur != 'x') {
        let size = Object.keys(donnee).length;
        let data = "";
        for (let i = 0; i < size; i++) {
            data += '<tr class="col-xs-1 text-center">'
            data += '<td class="col-xs-1 text-center">' + donnee[i]["prof"] + '</td>';
            data += '<td class="col-xs-1 text-center">' + donnee[i]["t"] + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["m15"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["m12"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["m9"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["m6"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["m3"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + donnee[i]["dtr"] + '</td>';
            data += '<td class="col-xs-1 text-center">' + donnee[i]["gps"] + '</td>';
            data += '</tr>';
        }
        tableau.innerHTML += data;
    }
    else {
        document.getElementById('infos').innerHTML = 'Veuillez entrer une profondeur valide.'
    }
}

/**
 * Fonction permettant de remplacer une case vide de la table par un '-' pour améliorer la lisibilité du tableau pour le client
 * @param values Valeur
 */
function decideNull(donnee) {if (donnee) {return donnee;}return '-';}

function clearTableau() {
    tableau.innerHTML = '<tr><th class="col-xs-1 text-center">Profondeur</th><th class="col-xs-1 text-center">Durée</th><th class="col-xs-1 text-center">Paliers 15m</th><th class="col-xs-1 text-center">Paliers 12m</th><th class="col-xs-1 text-center">Paliers 9m</th><th class="col-xs-1 text-center">Paliers 6m</th><th class="col-xs-1 text-center">Paliers 3m</th><th class="col-xs-1 text-center">DTR</th><th class="col-xs-1 text-center">GPS</th></tr>'
}