// TODO: Fixer l'élément actif dans la navbar.

addEventListener("DOMContentLoaded", () => {
    // Actualité
    ajaxRequest("GET", "/profil/amis/actualite", getActualiesAmis);
    // HEADER
    let recherche = document.getElementsByClassName("recherche");
    for (let i = 0; i < recherche.length; i++) {
        recherche[i].addEventListener("click", () => {
            ajaxRequest("GET", "/recherche", displayPage);
            // document.getElementById("nav-recherche").classList.add("active");
        });
    }

    let accueil = document.getElementsByClassName("accueil");
    for (let i = 0; i < accueil.length; i++) {
        accueil[i].addEventListener("click", () => {
            ajaxRequest("GET", "/accueil", displayPage);
            // addEventListener("DOMContentLoaded", () => {
                // document.getElementById("nav-accueil").classList.add("active");
            // });
        });
    }

    var connexion = document.getElementsByClassName("connexion");
    for (let i = 0; i < connexion.length; i++) {
        connexion[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/connexion", afficherConnexion)});
    }

    var inscription = document.getElementsByClassName("inscription");
    for (let i = 0; i < inscription.length; i++) {
        inscription[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/inscription", afficherConnexion)});
    }

    var deconnexion = document.getElementsByClassName("deconnexion");
    for (let i = 0; i < deconnexion.length; i++) {
        deconnexion[i].addEventListener("click", () => {ajaxRequest("POST", "/deconnexion", displayPageAdaptedForUser)});
    }

    var mesplongees = document.getElementsByClassName("mesplongees");
    for (let i = 0; i < mesplongees.length; i++) {
        mesplongees[i].addEventListener("click", () => {
            ajaxRequest("GET", "/profil/mesplongees", displayPage);
        })
    }

    var moncompte = document.getElementsByClassName("moncompte");
    for (let i = 0; i < moncompte.length; i++) {
        moncompte[i].addEventListener("click", () => {
            ajaxRequest("GET", "/profil/edit", displayPage);
        })
    }

    var mesamities = document.getElementsByClassName("mesamis");
    for (let i = 0; i < mesamities.length; i++) {
        mesamities[i].addEventListener("click", () => {
            ajaxRequest("GET", "/profil/amis", displayPage);
        })
    }

    var table = document.getElementsByClassName("bTable");
    for(let i=0;i<table.length;i++){
        table[i].addEventListener("click",() => {
            ajaxRequest("GET","/table",displayPage);
        });
    }

    var profils = document.getElementsByClassName("profils");
    console.log(profils);
    for(let i=0;i<profils.length;i++){
        console.log("i");
        profils[i].addEventListener("click",() => {
            ajaxRequest("GET","/profils",displayPage);
        });
    }

});