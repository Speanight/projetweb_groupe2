// TODO: Fixer l'élément actif dans la navbar.

addEventListener("DOMContentLoaded", () => {
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
});