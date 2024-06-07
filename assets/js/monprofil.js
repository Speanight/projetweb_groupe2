function main() {
    ajaxRequest("GET", "/profil/get", fillUserForm);
    // addEventListener("DOMContentLoaded", () => {
    //     document.getElementById("editCompte").addEventListener("click", () => {
    //         console.log("envoi données compte");
    //         var data = "";
    //         data += "prenom=" + document.getElementsByName("prenom")[0].value;
    //         data += "&nom=" + document.getElementsByName("nom")[0].value;
    //         data += "&email=" + document.getElementsByName("email")[0].value;
    //         data += "&newPassword=" + document.getElementsByName("newPassword")[0].value;
    //         data += "&newPasswordVerify=" + document.getElementsByName("newPasswordVerify")[0].value;
    //         data += "&publicity=";
    //         var publicity = document.getElementsByName("publicity");
    //         for (let i = 0; i < publicity.length; i++) {
    //             if (publicity[i].checked) {
    //                 data += publicity[i].value;
    //             }
    //         }
    //         data += "&password=" + document.getElementsByName("password")[0].value;

    //         ajaxRequest("PUT", "/profil/update", console.log, data);
    //     });
    // })
}

/** Fonction permettant d'afficher les données de l'utilisateur dans le formulaire automatiquement selon les informations de la base de données.
 * 
 * @param {Array} data Les données renvoyées par l'ajaxRequest, doit contenir 'user' pour fonctionner.
 */
function fillUserForm(data) {
    displayPageAdaptedForUser(data);
    if ('user' in data) {
        var user = data['user'];
        for (const key in user) {
            const elem = document.getElementsByName(key);
            for (let i = 0; i < elem.length; i++) {
                elem[i].value = user[key];
            }
        }
    }
}

function editCompte() {

}

main();