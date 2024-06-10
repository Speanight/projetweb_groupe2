function main() {
    ajaxRequest("GET", "/profil/get", fillUserForm);
    addEventListener("DOMContentLoaded", () => {
        document.getElementById("editCompte").addEventListener("click", () => {
            console.log("envoi données compte");
            var data = "";
            data += "prenom=" + document.getElementsByName("prenom")[0].value;
            data += "&nom=" + document.getElementsByName("nom")[0].value;
            data += "&email=" + document.getElementsByName("email")[0].value;
            data += "&newPassword=" + document.getElementsByName("newPassword")[0].value;
            data += "&newPasswordVerify=" + document.getElementsByName("newPasswordVerify")[0].value;
            data += "&publicity=";
            var publicity = document.getElementsByName("publicity");
            for (let i = 0; i < publicity.length; i++) {
                if (publicity[i].checked) {
                    data += publicity[i].value;
                }
            }
            data += "&password=" + document.getElementsByName("password")[0].value;

            ajaxRequest("PUT", "/profil/update", console.log, data);
        });
    });

    var tagColors = document.getElementsByClassName("tagColor");
    for (let i = 0; i < tagColors.length; i++) {
        tagColors[i].addEventListener("click", () => {
            const values = tagColors[i].id.split('-');
            console.log(values);
            var nom = document.getElementById("nomTag-" + values[2]);
            ajaxRequest("UPDATE", "/profil/update/tag", console.log, "tag=" + values[2] + "&type=" + values[1] + "&nom=" + nom);
        });
    }

    var deleteTag = document.getElementsByClassName("deleteTag");
    for (let i = 0; i < deleteTag.length; i++) {
        deleteTag[i].addEventListener("click", function(event) {
            const id = deleteTag[i].id.split('-')[1];
            if (event.target.parentNode.classList == "input-group") {
                event.target.parentNode.remove();
            }
            else {
                event.target.parentNode.parentNode.remove();
            }
            ajaxRequest("DELETE", "/profil/delete/tag", console.log, "tag=" + id);
        })
    }

    var editTag = document.getElementsByClassName("editTag");
    console.log(editTag);
    for (let i = 0; i < editTag.length; i++) {
        editTag[i].addEventListener("click", () => {
            const id = editTag[i].id.split('-')[1];
            var nom = document.getElementById("nomTag-" + id).value;
            ajaxRequest("UPDATE", "/profil/update/tag", console.log, "tag=" + id + "&nom=" + nom);
        })
    }
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

        const states = document.getElementsByName("publicity");
        console.log(states);
        for (let i = 0; i < states.length; i++) {
            if (data['user'].state == i) {
                states[i].checked = "true";
            }
        }
    }
}

function editCompte() {

}

main();