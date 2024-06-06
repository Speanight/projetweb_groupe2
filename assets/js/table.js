'use strict';

const tableau = document.getElementById('table_plonge');
let select = document.getElementById('profondeur');
const form = document.getElementById('form_p');
const value = document.getElementById('value');

let profondeur = 0;

ajaxRequest('GET','php/request.php/getPlongees/',remplireForm);

/**
 * Fonction permettant de remplir le formulaire de select avec la profondeur de toutes les plongées qui ont été effectué.
 * @param {Array} donnee Tableau de dictionnaire
 */
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

/**
 * Fonction permettant de remplir le tableau des valeurs que la requète ajax renverra.
 * @param {Array} values Tableau de dictionnaire
 */
function remplireTableau(donnee) {
    document.getElementById('infos').innerHTML = '';
    clearTableau();
    if (profondeur != 'x') {
        let size = Object.keys(donnee).length;
        let data = "";
        for (let i = 0; i < size; i++) {
            data += '<tr>'
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["prenom_user"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["nom_user"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["profondeur"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["duree"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["bar_initial"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["volume_initial"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["note"]) + '</td>';
            data += '<td class="col-xs-1 text-center">' + decideNull(donnee[i]["description"]) + '</td>';
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
 * @param {Array} values Valeur
 */
function decideNull(donnee) {if (donnee) {return donnee;}return '-';}

function clearTableau() {
    tableau.innerHTML = '<tr><th class="col-xs-1 text-center">Prénom</th><th class="col-xs-1 text-center">Nom</th><th class="col-xs-1 text-center">Profondeur</th><th class="col-xs-1 text-center">Durée</th><th class="col-xs-1 text-center">Pression initiale</th><th class="col-xs-1 text-center">Volume initiale</th><th class="col-xs-1 text-center">Note</th><th class="col-xs-1 text-center">Description</th></tr>'
}