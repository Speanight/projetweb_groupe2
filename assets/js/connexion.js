var connexion = document.getElementsByClassName("connexion");
for (let i = 0; i < connexion.length; i++) {
    connexion[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/connexion", afficherConnexion)});
}

var inscription = document.getElementsByClassName("inscription");
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
    var connexion = document.getElementsByClassName("connexion");
    for (let i = 0; i < connexion.length; i++) {
        connexion[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/connexion", afficherConnexion)});
    }

    var inscription = document.getElementsByClassName("inscription");
    for (let i = 0; i < inscription.length; i++) {
        inscription[i].addEventListener("click", () => {ajaxRequest("GET", "/modal/inscription", afficherConnexion)});
    }

    // Inscription/Connexion quand on clique sur le bouton.
    var connect = document.getElementById("connexion-compte")
    if (connect != null) {
            connect.addEventListener("click", () => {
            const mail = document.getElementsByName("email")[0].value;
            const password = document.getElementsByName("password")[0].value;
            ajaxRequest("POST", "/connexion", connectUser, "mail=" + mail + "&pass=" + password);
            ajaxRequest("GET", "/profil/get", displayPageAdaptedForUser);
        });
    }

    var inscript = document.getElementById("inscription-compte");
    if (inscript != null) {
        inscript.addEventListener("click", () => {
            const prenom = document.getElementsByName("prenom")[0].value;
            const nom = document.getElementsByName("nom")[0].value;
            const email = document.getElementsByName("email")[0].value;
            const password = document.getElementsByName("pass")[0].value;
            const passwordVerify = document.getElementsByName("passVerify")[0].value;
            const states = document.getElementsByName("publicity");
            
            for (let i = 0; i < states.length; i++) {
                if (states.checked) {
                    const state = states.value;
                }
            }

            ajaxRequest("PUT", "/inscription", connectUser, "prenom=" + prenom + "&nom=" + nom + "&email=" + email + "&password=" + password + "&passwordVerify=" + passwordVerify + "&state=" + state);
        });
    }
}

function connectUser(data) {
    if ("success" in data) {
        let elem = document.getElementById("connexion");
        elem.classList = "modal hidden Tmodal";
        displayPageAdaptedForUser(data);
    }
}