const connexion = document.getElementsByClassName("connexion");
for (let i = 0; i < connexion.length; i++) {
    connexion[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/connexion", afficherConnexion)});
}

const inscription = document.getElementsByClassName("inscription");
for (let i = 0; i < inscription.length; i++) {
    inscription[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/inscription", afficherConnexion)});
}

function afficherConnexion(data) {
    // Ajout de l'élément modal à la bonne position.
    let elem = document.getElementById("connexion");
    elem.classList = "modal shown Tmodal";
    appendToPage(data, "connexion");

    // Ajout du bouton pour fermer le modal.
    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
    });

    // Re-attribution des boutons de connexion et d'inscription (pour les nouveaux boutons).
    const connexion = document.getElementsByClassName("connexion");
    for (let i = 0; i < connexion.length; i++) {
        connexion[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/connexion", afficherConnexion)});
    }

    const inscription = document.getElementsByClassName("inscription");
    for (let i = 0; i < inscription.length; i++) {
        inscription[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/inscription", afficherConnexion)});
    }

    // Inscription/Connexion quand on clique sur le bouton.
    const connect = document.getElementById("connexion-compte").addEventListener("click", () => {
        const mail = document.getElementsByName("email")[0].value;
        const password = document.getElementsByName("password")[0].value;
        ajaxRequest("POST", "/connexion", connectUser, "mail=" + mail + "&pass=" + password);
    });
}

function connectUser(data) {
    console.log("connecting?");
}