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
        const id = tagColors[i].id;
        console.log(id);
        tagColors[i].addEventListener("click", function(event) {
            const values = event.id.split('-');
            console.log(values);
            var nom = document.getElementById("nomTag-" + values[2]);
            ajaxRequest("UPDATE", "/profil/update/tag", console.log, "tag=" + values[2] + "&type=" + values[1] + "&nom=" + nom);
        });
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


/** Fonction pour supprimer un tag en cliquant sur un bouton. A ajouter en onclick.
 * 
 * @param {element} element Le bouton supprimer, ayant également l'id du tag à supprimer.
 */
function deleteTag(element) {
    const id = element.id.split('-')[1];
    ajaxRequest("DELETE", "/profil/delete/tag", console.log, "tag=" + id);
    element.parentNode.remove();
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

main();