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
});