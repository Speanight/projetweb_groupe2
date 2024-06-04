addEventListener("DOMContentLoaded", () => {
    let recherche = document.getElementsByClassName("recherche");
    for (let i = 0; i < recherche.length; i++) {
        console.log(recherche[i]);
        recherche[i].addEventListener("click", () => {
            ajaxRequest("GET", "/recherche", displayPage);
        });
    }
});
