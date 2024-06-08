var ajoutAmi = document.getElementsByClassName("ajoutAmi");
ajaxRequest("GET", "/profil/amis/actualite", getActualiesAmis);

for (let i = 0; i < ajoutAmi.length; i++) {
    ajoutAmi[i].addEventListener("click", () => {
        ajaxRequest("GET", "/modal/profile/add/ami", showModalAddAmi);
        const modal = document.getElementById("modal");
        modal.classList = "modal shown Tmodal";
    })
    // eventAddAmi();
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