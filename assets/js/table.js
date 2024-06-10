
addEventListener("DOMContentLoaded", () => {

    ajaxRequest('GET','/getprof',remplireForm);


    let form = document.getElementById('form_p');
    form.addEventListener('change', function handleChange(event) {
        profondeur = event.target.value;
        console.log(profondeur);
        ajaxRequest('GET','/dbgettable',remplireTableau,"profondeur="+profondeur);
        
    });


    
});



/**
 * Fonction permettant de remplir le formulaire de select avec la profondeur de toutes les plongées qui ont été effectué.
 * @param {Array} donnee Tableau de dictionnaire
 */
function remplireForm(donnee) {
    console.log(donnee["plongee"][0]["profondeur_palier"]);
    let select = document.getElementById('profondeur');
    select.innerHTML = "";
    let size = donnee["plongee"].length;

    for (let i = 0; i < size; i++) {
        select.options[select.options.length] = new Option(donnee["plongee"][i]["profondeur_palier"] + 'm', donnee["plongee"][i]["profondeur_palier"]);
    }
}


/**
 * Fonction permettant de remplir le tableau des valeurs que la requète ajax renverra.
 * @param {Array} donnee Tableau de dictionnaire
 */
function remplireTableau(donnees) {

    let tableau = document.getElementById('table_plonge');

    clearTableau();
    donnees.forEach(function(donnee){ 

        let data = "";
        data += '<tr class="col-xs-1 text-center">'
        data += '<td class="col-xs-1 text-center">' + donnee["profondeur_palier"] + '</td>';
        data += '<td class="col-xs-1 text-center">' + donnee["duree_dp"] + '</td>';
        data += '<td class="col-xs-1 text-center">' + decideNull(donnee["palier15m"]) + '</td>';
        data += '<td class="col-xs-1 text-center">' + decideNull(donnee["palier12m"]) + '</td>';
        data += '<td class="col-xs-1 text-center">' + decideNull(donnee["palier9m"]) + '</td>';
        data += '<td class="col-xs-1 text-center">' + decideNull(donnee["palier6m"]) + '</td>';
        data += '<td class="col-xs-1 text-center">' + decideNull(donnee["palier3m"]) + '</td>';
        data += '<td class="col-xs-1 text-center">' + donnee["duree_dtr"] + '</td>';
        data += '<td class="col-xs-1 text-center">' + donnee["gps"] + '</td>';
        data += '</tr>';
        tableau.innerHTML += data;

    });






}

/**
 * Fonction permettant de remplacer une case vide de la table par un '-' pour améliorer la lisibilité du tableau pour le client
 * @param values Valeur
 */
function decideNull(donnee) {if (donnee) {return donnee;}return '-';}

function clearTableau() {
    let tableau = document.getElementById('table_plonge');
    tableau.innerHTML = '<tr><th class="col-xs-1 text-center">Profondeur</th><th class="col-xs-1 text-center">Durée</th><th class="col-xs-1 text-center">Paliers 15m</th><th class="col-xs-1 text-center">Paliers 12m</th><th class="col-xs-1 text-center">Paliers 9m</th><th class="col-xs-1 text-center">Paliers 6m</th><th class="col-xs-1 text-center">Paliers 3m</th><th class="col-xs-1 text-center">DTR</th><th class="col-xs-1 text-center">GPS</th></tr>'
}