function afficherModal(data) {
    // Ajout de l'élément modal à la bonne position.
    let elem = document.getElementById("modal");
    elem.classList = "modal shown Tmodal";
    appendToPage(data, "modal");

    // Ajout du bouton pour fermer le modal.
    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
    });
}

addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-modal-plongees").addEventListener("click", () => {
        ajaxRequest("GET", "/modal/ajout/plongee", afficherModal);
    })
})