function afficherModalPlongee(data) {
    // Ajout de l'élément modal à la bonne position.
    let elem = document.getElementById("modal");
    elem.classList = "modal shown Tmodal";
    appendToPage(data, "modal");

    // Ajout du bouton pour fermer le modal.
    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
    });

    document.getElementById("profondeur").addEventListener("change", () => {
        console.log("changed!");
        var profondeur = document.getElementById("profondeur").value;
        var duree = document.getElementById("duree").value;
        ajaxRequest("GET", "/plongee/verify", ajoutTagAutomatique, "profondeur=" + profondeur + "&duree=" + duree);
    });

    // Ajout du bouton pour envoyer formulaire.
    document.getElementById("btn-add-plongee").addEventListener("click", () => {
        const volume = document.getElementsByName("volume")[0].value;
        const pression = document.getElementsByName("pression")[0].value;
        const profondeur = document.getElementsByName("profondeur")[0].value;
        const duree = document.getElementsByName("duree")[0].value;
        const elemNote = document.getElementsByName("note");
        const description = document.getElementsByName("description")[0].value;
        var note = 0;
        const jour = document.getElementsByName("jour")[0].value;

        for (let i = 0; i < elemNote.length; i++) {
            if (elemNote[i].checked == true) {
                note = elemNote[i].value;
            }
        }

        ajaxRequest("PUT", "/profil/plongee/add", console.log, "volume=" + volume + "&pression=" + pression + "&profondeur=" + profondeur + "&jour=" + jour + "&duree=" + duree + "&note=" + note + "&description=" + description);
    });
}

addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-modal-plongees").addEventListener("click", () => {
        ajaxRequest("GET", "/modal/ajout/plongee", afficherModalPlongee);
    });
});

function ajoutTagAutomatique(data) {
    if ('tag' in data) {
        document.getElementById("tags-placement").innerHTML = data["tag"];
    }
}