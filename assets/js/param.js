/**
 * Fonction permettant de convertir un tableau de valeurs en un graphique grâce à Chart.JS.
 * @param {Array} values Tableau de valeurs compatible avec Chart.JS
 */
function createGraph(values) {
    const temps = values["temps"];
    const pressionAmbiante = values["pression ambiante"];
    const consommationAir = values["consommation"];
    const pressionRestante = values["bar restant"];
    const airRestant = values["vol restant"];
    const labels = generateLabels(values["profondeur"]);
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
        labels.push("t"+i);
    }
    return labels;
}



addEventListener("DOMContentLoaded", () => {

    //Event lorsque l'on clique sur le bouton Paramètres --> affichage du formulaire
    let bParam = document.getElementsByClassName("bParam");
    for (let i = 0; i < bParam.length; i++) {
        bParam[i].addEventListener("click",() => {
            ajaxRequest("GET","/formparam",displayPage);
        });
    }

    document.getElementById('formParam').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting
        
        var profondeur = this.querySelector('.selectProfondeur').value;
        var duree = this.querySelector('.selectDuree').value;


        ajaxRequest("GET", "/graph", showGraph,"profondeur=" + profondeur + "&duree=" + duree);
    });

});


function showGraph(values){

    

    console.log("Je suis dans showGraph");
    profondeur = values['mn90'][0];
    duree = values['mn90'][1];
    paliers = convertArrayIfNull(values['mn90'][2]);

    dictValues = generateInfos(profondeur,duree,200,3000,paliers);

    console.log(dictValues);
    

    document.getElementById("canvas").style.display = "block";
    createGraph(dictValues);


}








