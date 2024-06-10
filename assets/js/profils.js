addEventListener("DOMContentLoaded", () => {

    ajaxRequest('GET','/getplongees',remplireForm);

    let form = document.getElementById('form_p');
    form.addEventListener('change', function handleChange(event) {
        profondeur = event.target.value;
        if (profondeur != 'x')
            ajaxRequest('GET','/getplongees',remplireTableau);
        else  {
            document.getElementById('infos').innerHTML = 'Veuillez entrer une profondeur valide.'
        }
        
    });
    
    
});


function remplireForm(donnees) {
    console.log(donnees);
    let size = donnees["plongees"].length;
    console.log(size);
    let select = document.getElementById('profondeur');

    for (let i = 0; i < size; i++) {
        select.options[select.options.length] = new Option(donnees["plongees"][i]["profondeur"] + 'm', donnees["plongees"][i]["profondeur"]);
    }
}



function remplireTableau(donnees) {

    let donnee = donnees["plongees"];
    let tableau = document.getElementById('table_plonge');
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

function decideNull(donnee) {if (donnee) {return donnee;}return '-';}

function clearTableau() {
    let tableau = document.getElementById('table_plonge');
    tableau.innerHTML = '<tr><th class="col-xs-1 text-center">Prénom</th><th class="col-xs-1 text-center">Nom</th><th class="col-xs-1 text-center">Profondeur</th><th class="col-xs-1 text-center">Durée</th><th class="col-xs-1 text-center">Pression initiale</th><th class="col-xs-1 text-center">Volume initiale</th><th class="col-xs-1 text-center">Note</th><th class="col-xs-1 text-center">Description</th></tr>'
}