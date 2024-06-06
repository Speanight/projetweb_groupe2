'use strict';

let select = document.getElementById('profondeur');
const form = document.getElementById('form_p');
const tableau = document.getElementById('table_plonge');
const value = document.getElementById('value');
ajaxRequest('GET','php/request.php/getProf/',remplireForm);

function remplireForm(donnee) {
    let size = Object.keys(donnee).length;
    console.log(size);
    for (let i = 0; i < size-1; i++) {
        select.options[select.options.length] = new Option(donnee[i]["prof"], donnee[i]["prof"]);
    }
}

form.addEventListener('change', function handleChange(event) {
    ajaxRequest('GET','php/request.php/dbGetTable/'+event.target.value,remplireTableau);
});

function remplireTableau(donnee) {
    clearTableau();
    let size = Object.keys(donnee).length;
    let data = "";
    for (let i = 0; i < size; i++) {
        data += '<tr>'
        data += '<td>' + donnee[i]["prof"] + '</td>';
        data += '<td>' + donnee[i]["t"] + '</td>';
        data += '<td>' + decideNull(donnee[i]["m15"]) + '</td>';
        data += '<td>' + decideNull(donnee[i]["m12"]) + '</td>';
        data += '<td>' + decideNull(donnee[i]["m9"]) + '</td>';
        data += '<td>' + decideNull(donnee[i]["m6"]) + '</td>';
        data += '<td>' + decideNull(donnee[i]["m3"]) + '</td>';
        data += '<td>' + donnee[i]["dtr"] + '</td>';
        data += '<td>' + donnee[i]["gps"] + '</td>';
        data += '</tr>';
    }
    tableau.innerHTML += data;
}

function decideNull(donnee) {if (donnee) {return donnee;}return '-';}

function clearTableau() {
    tableau.innerHTML = '<tr><th>Profondeur</th><th>Durée</th><th>Paliers 15m</th><th>Paliers 12m</th><th>Paliers 9m</th><th>Paliers 6m</th><th>Paliers 3m</th><th>DTR</th><th>GPS</th></tr>'
}