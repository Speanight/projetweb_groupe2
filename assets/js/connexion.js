let connexion = document.getElementsByClassName("connexion");
for (let i = 0; i < connexion.length; i++) {
    connexion[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/connexion", afficherConnexion)});
}

function afficherConnexion(data) {
    let elem = document.getElementById("connexion");
    elem.classList = "modal shown Tmodal";
    // elem.classList -= "hidden";
    appendToPage(data, "connexion");

    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
        // elem.classList -= "shown";
    });
}