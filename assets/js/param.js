/**
 * Fonction permettant de convertir un tableau de valeurs en un graphique grâce à Chart.JS.
 * @param {Array} values Tableau de valeurs compatible avec Chart.JS
 */
function createGraph(values) {
    const temps = additionNumberWithPreviousInArray(values["temps"]);
    const pressionAmbiante = values["pression ambiante"];
    const consommationAir = values["consommation"];
    const pressionRestante = values["bar restant"];
    const airRestant = values["vol restant"];
    const labels = generateLabels(temps);
    const data = {
    labels: labels,
    datasets: [
        {
            label: 'Profondeur',
            data: invertNumbersInArray(values["profondeur"])
        }
    ]
    };

    const lineChart = document.getElementById("canvas");

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                // Tooltip: affichage de : profondeur, temps, pression ambiante, consommation d'air (cumulée), pression restante dans la bouteille, volume d'air restant dans la bouteille
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: function() {return "Détails"},
                        afterTitle: function(context) {return "Temps : " + temps[context[0].dataIndex]},
                        footer: function(context) {
                            let consoTotale = 0;
                            for (let i = 0; i < context[0].dataIndex + 1; i++) {
                                consoTotale = consommationAir[i];
                            }
                            let text = `Pression ambiante : ${pressionAmbiante[context[0].dataIndex]}\n`;
                            text += `Consommation d'air (totale) : ${consoTotale}\n`;
                            text += `Pression restante dans la bouteille : ${pressionRestante[context[0].dataIndex]}\n`;
                            text += `Volume d'air restant dans la bouteille : ${airRestant[context[0].dataIndex]}\n`;

                            return text;
                        }
                    }
                }
            }
        }
    }

    new Chart(lineChart, config);
}

/**
 * Fonction générant une liste de n éléments nommés "tx", où n est le nombre d'éléments de l'argument envoyé à la fonction.
 * @param {Array} values valeurs qui seront prises par le graphe.
 * @returns Liste des 'tx' où x représente un nombre allant de 0 à n.
 */
function generateLabels(values) {
    let labels = [];
    for (let i = 0; i < values.length; i++) {
        labels.push(values[i]);
    }
    return labels;
}




addEventListener("DOMContentLoaded", () => {


    if(document.getElementsByClassName('selectProfondeur')[0] !== undefined){
        var profondeur = document.getElementsByClassName('selectProfondeur')[0].options[0].value;
        ajaxRequest("GET", "/formparam/duree", addSelectDureeToForm,"profondeur=" + profondeur);
    }


    //Event lorsque l'on clique sur le bouton Paramètres --> affichage du formulaire
    let bParam = document.getElementsByClassName("bParam");
    for (let i = 0; i < bParam.length; i++) {
        bParam[i].addEventListener("click",() => {
            console.log('i');
            ajaxRequest("GET","/formparam",displayPage);
        });
    }
    if(document.getElementById('formParam') !== undefined){
        document.getElementById('formParam').addEventListener('submit', function(event) {
            event.preventDefault(); // Permet au form de ne pas rafraichir la page lors de l'envoi
            
            var profondeur = this.querySelector('.selectProfondeur').value;
            var duree = this.querySelector('.selectDuree').value;
    
            let formParam = document.getElementsByClassName("paramContainer")[0];
            formParam.style.display = "none";
    
            ajaxRequest("GET", "/graph", showGraph,"profondeur=" + profondeur + "&duree=" + duree);
        });
    }



    let selectProfondeur = document.getElementsByClassName("selectProfondeur");

    for(let i=0;i<selectProfondeur.length;i++){
        selectProfondeur[i].addEventListener("change", function (event){

            var profondeur = this.value;
            ajaxRequest("GET", "/formparam/duree", addSelectDureeToForm,"profondeur=" + profondeur);
        });
    }


});


function showGraph(values){


    //Affichage du graph

    profondeur = values['mn90'][0];
    duree = values['mn90'][1];

    paliers = convertArrayIfNull(values['mn90'][2]);


    dictValues = generateInfos(profondeur,duree,200,3000,paliers);

    console.log(dictValues);

    document.getElementById("canvas").style.display = "block";
    document.getElementsByClassName("table-responsive")[0].style.display = "block";
    createGraph(dictValues);

    //Affichage du tableau

    // Affichage du tableau
    let titles = ["profondeur", "temps", "pression ambiante", "consommation", "bar restant", "vol restant"];
    let titlesLength = titles.length;
    console.log(titlesLength);

    var refTable = document.getElementById("tbodyTab");
    console.log(titles[0]);
    let valuesLength = dictValues[titles[0]].length;
    console.log(valuesLength);



    // Insérer les données du tableau
    for (let k = 0; k < valuesLength; k++) {
        // Insère une nouvelle ligne pour chaque ensemble de valeurs
        var nouvelleLigne = refTable.insertRow(k);
        
        // Insère la première cellule avec l'index "t"
        var nouvelleCellule = nouvelleLigne.insertCell(0);
        var nouveauTexte = document.createTextNode("t" + (k));
        nouvelleCellule.appendChild(nouveauTexte);

        // Insère les cellules pour les valeurs des titres
        for (let i = 0; i < titlesLength; i++) {
            var nouvelleCellule = nouvelleLigne.insertCell(i + 1);
            var nouveauTexte = document.createTextNode(dictValues[titles[i]][k]);
            nouvelleCellule.appendChild(nouveauTexte);
        }
    }






}

function addSelectDureeToForm(values){

    $values_duree = values['duree_dp'];
    let divSelectDuree = document.getElementById("divDuree");
    divSelectDuree.style.display = "block";
    let submitButton = document.getElementById("submitButton");
    submitButton.style.display = "block";


    $values_duree.forEach(function(value){



        let selectDuree = document.getElementsByClassName("selectDuree");

        for(let i=0;i<selectDuree.length;i++){
            var select = selectDuree[i];
            select.options[select.options.length] = new Option ("" + value['duree_dp'] + " minutes",value['duree_dp']);
        }

    });


}










