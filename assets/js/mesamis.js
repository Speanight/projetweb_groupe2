var ajoutAmi = document.getElementsByClassName("ajoutAmi");
ajaxRequest("GET", "/profil/amis/actualite", getActualiesAmis);

for (let i = 0; i < ajoutAmi.length; i++) {
    ajoutAmi[i].addEventListener("click", () => {
        ajaxRequest("GET", "/modal/profile/add/ami", showModalAddAmi);
        const modal = document.getElementById("modal");
        modal.classList = "modal shown Tmodal";

        ajaxRequest("GET", "/profil/get/amis", showListAmi);
    })
    // eventAddAmi();
}

function showListAmi(data) {
    if ('follows' in data) {
        var elem = document.getElementById("liste-amis");
        var text = "";
        for (let i = 0; i < data['follows'].length; i++) {
            const element = data["follows"][i];
            console.log(element);

            text += `
            <div class="col-lg-4">
                <img src="/assets/img/pfp/${element.image}" class=rounded-circle" width="140" height="140" />
                <h4 class="fw-normal">${element.nom} ${element.prenom}</h4>
                <p>${element.email}</p>
                <button id="${element.id}" class="deleteFriend mb-2 btn btn-lg rounded-3 btn-danger">Supprimer l'ami</button>
            </div>
            `
        }
        elem.innerHTML = text;

        var friends = document.getElementsByClassName("deleteFriend");
        for (let i = 0; i < friends.length; i++) {
            const id = friends[i].id;
            const elem = document.getElementById(id);

            elem.addEventListener("click", () => {
                ajaxRequest("DELETE", "/profil/delete/ami", console.log, "id=" + id);
                elem.parentNode.remove();
            })
        }
    }
}


function showModalAddAmi(data) {
    let elem = document.getElementById("modal");
    elem.innerHTML = data['modal'];
    
    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
        elem.innerHTML = "";
    });

    const newFollower = document.getElementById("newFollower");
    newFollower.addEventListener("click", () => {
        const email = document.getElementsByName("email")[0].value;
        ajaxRequest("PUT", "/profil/add/ami", console.log, "email=" + email);
    })
}