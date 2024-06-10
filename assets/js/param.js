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
    const valuesTpsInvert = invertNumbersInArray(values['profondeur']);
    const data = {
    labels: labels,
    datasets: [
        {
            label: 'Profondeur',
            data: valuesTpsInvert,
            borderColor: function(context) {
                const index = context.dataIndex;

                if(pressionRestante[index]<= 50){
                    return 'red';
                }
                else{
                    return 'blue';
                }
            },
            segment: {
                borderColor: ctx => {
                    return pressionRestante[ctx.p0DataIndex] <= 50 || pressionRestante[ctx.p1DataIndex] <= 50 ? 'red' : 'blue';
                }
            },
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
        }
    ]
    };

    const lineChart = document.getElementById("canvas");


    //TODO: Ajouter des légendes sur les axes
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



//Gestion des listeners et envoie des requêtes AJAX
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


    //Afficher la durée en fonction de la profondeur choisie par l'utilisateur lors d'un select dans le formulaire
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

    let bar_inital = 200;

    let consoTotale = getTotalConso(profondeur,duree,paliers);
    
    let bestBottles = getBestBottle(consoTotale);

    console.log(bestBottles);

    let consoOfBestBottles = 0;

    for (var [key, value] of Object.entries(bestBottles)){
        consoOfBestBottles += key*value;
    }

    


    var dictValues = generateInfos(profondeur,duree,bar_inital,consoOfBestBottles*bar_inital,paliers);


    console.log(dictValues);

    document.getElementById("canvas").style.display = "block";
    document.getElementsByClassName("table-responsive")[0].style.display = "block";
    
    createGraph(dictValues);

    // Affichage du tableau
    let titles = ["profondeur", "temps", "pression ambiante", "consommation", "bar restant", "vol restant"];
    let titlesLength = titles.length;

    var refTable = document.getElementById("tbodyTab");
    let valuesLength = dictValues[titles[0]].length;




    // Insérer les données du tableau
    for (let k = 0; k < valuesLength; k++) {
        // Insère une nouvelle ligne pour chaque ensemble de valeurs
        var nouvelleLigne = refTable.insertRow(k);
        
        // Insère la première cellule avec l'index "t"
        var nouvelleCellule = nouvelleLigne.insertCell(0);
        var nouveauTexte = document.createTextNode("t" + (k));
        nouvelleCellule.appendChild(nouveauTexte);
        if(dictValues['bar restant'][k] <= 50){
            nouvelleCellule.style.color = 'red';
        }

        // Insère les cellules pour les valeurs des titres
        for (let i = 0; i < titlesLength; i++) {

            if(dictValues['bar restant'][k] <= 50){
                var nouvelleCellule = nouvelleLigne.insertCell(i + 1);
                nouvelleCellule.style.color = 'red';
                var nouveauTexte = document.createTextNode(dictValues[titles[i]][k]);
                
                nouvelleCellule.appendChild(nouveauTexte);
            }
            else{
                var nouvelleCellule = nouvelleLigne.insertCell(i + 1);
                var nouveauTexte = document.createTextNode(dictValues[titles[i]][k]);
                nouvelleCellule.appendChild(nouveauTexte);
            }

        }
    }

    //Ajout des informations à la modal "infos supplémentaires" pour que l'utilisateur ait des infos sur les bouteilles qu'il doit prendre au minimum

    let modalBody = document.getElementsByClassName("modal-body")[0];

    var counterCard = 0;
    //Affichage des bouteilles dans la modal
    for (var [key, value] of Object.entries(bestBottles)){

        var card = `<div class="card" style="width: 18rem;">
                        <img src="/assets/img/bouteille_o2/bouteilleo2.jpg" class="card-img-top" alt="Bouteille d'oxygène">
                        <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
        `;
        modalBody.innerHTML = modalBody.innerHTML + card;

        let thisCardTitle = document.getElementsByClassName("card-title")[counterCard];
        let thisCardText = document.getElementsByClassName("card-text")[counterCard];

        thisCardTitle.innerHTML = "Bouteille " + key + "L";
        thisCardText.innerHTML = "<p><U>Quantité :</U> " + value + "x</p>" +
                                 "<U>Pression :</U> 200 bar\n";

        counterCard++;

    }





}

function addSelectDureeToForm(values){

    $values_duree = values['duree_dp'];
    let divSelectDuree = document.getElementById("divDuree");
    divSelectDuree.style.display = "block";
    let submitButton = document.getElementById("submitButton");
    submitButton.style.display = "block";
    let selectDuree = document.getElementsByClassName("selectDuree")[0];
    while (selectDuree.options.length > 0) {
        selectDuree.remove(0);
    }


    $values_duree.forEach(function(value){



        let selectDuree = document.getElementsByClassName("selectDuree");


        for(let i=0;i<selectDuree.length;i++){
            var select = selectDuree[i];

            select.options[select.options.length] = new Option ("" + value['duree_dp'] + " minutes",value['duree_dp']);
        }

    });


}









