function afficherModalPlongee(data) {
    // Ajout de l'élément modal à la bonne position.
    let elem = document.getElementById("modal");
    elem.classList = "modal shown Tmodal";
    appendToPage(data, "modal");

    actualiserTags(data);

    const elemTags = document.getElementsByClassName("tags");

    // Ajout du "mini-formulaire" pour ajouter un tag.
    document.getElementById("btn-add-tag").addEventListener("click", () => {
        console.log("add tag!");
        const name = document.getElementsByName("tag-name")[0].value;
        const type = document.getElementsByName("tag-type")[0].value;
        ajaxRequest("PUT", "/profil/add/tag", actualiserTags, "nom=" + name + "&type=" + type);
    })


    // Ajout du bouton pour fermer le modal.
    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
    });

    // Affiche le tag MN90 si les conditions sont respectées : vérifie à chaque modification du champ.
    document.getElementById("profondeur").addEventListener("keyup", () => {
        var profondeur = document.getElementById("profondeur").value;
        var duree = document.getElementById("duree").value;
        ajaxRequest("GET", "/plongee/verify", ajoutTagAutomatique, "profondeur=" + profondeur + "&duree=" + duree);
    });

    document.getElementById("duree").addEventListener("keyup", () => {
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
        const generalTags = document.getElementById("automatic-tags-placement");
        const activatedTags = document.getElementById("activated-tags-placement");

        var tagsId = [];

        for (let i = 0; i < generalTags.childNodes.length; i++) {
            tagsId.push(generalTags.childNodes[i].id.split("-")[1]);
        }

        for (let i = 0; i < activatedTags.childNodes.length; i++) {
            tagsId.push(activatedTags.childNodes[i].id.split("-")[1]);
        }

        var note = 0;
        const jour = document.getElementsByName("jour")[0].value;

        for (let i = 0; i < elemNote.length; i++) {
            if (elemNote[i].checked == true) {
                note = elemNote[i].value;
            }
        }

        ajaxRequest("PUT", "/profil/add/plongee", ajoutPlongeeTableau, "volume=" + volume + "&pression=" + pression + "&profondeur=" + profondeur + "&jour=" + jour + "&duree=" + duree + "&note=" + note + "&description=" + description + "&tags=" + tagsId);
    });
}

addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-modal-plongees").addEventListener("click", () => {
        ajaxRequest("GET", "/modal/ajout/plongee", afficherModalPlongee);
    });
});

function ajoutPlongeeTableau(data) {
    if ('plongees' in data) {
        var table = document.getElementById("table-mesplongees");
        table.innerHTML = "";
        for (let i = 0; i < data["plongees"].length; i++) {
            const plongee = data["plongees"][i];
            var description = plongee.description;
            if (description.length >= 50) {
                description = description.substring(0, 47) + "...";
            }
            var note = "";
            for (let i = 0; i < plongee.note; i++) {
                note += "★";
            }
            var tags = "";
            for (let i = 0; i < plongee.tags.length; i++) {
                const tag = plongee.tags[i];
                tags += `<span id="tag-${tag.id}" class="badge bg-${tag.type}-subtle text-${tag.type}-emphasis rounded-pill">${tag.nom}</span>`
            }
            table.innerHTML += `
            <tr class="plongee-row" id="${plongee.id}">
                <th scope="row">${plongee.day}</th>
                <td>${plongee.profondeur}</td>
                <td>${plongee.duree}</td>
                <td>${plongee.bar_initial}</td>
                <td>${plongee.volume_initial}</td>
                <td>${note}</td>
                <td>${tags}</td>
                <td class="shortdesc" id="shortdesc-plongee-${plongee.id}">${description}</td>
                <td class="fulldesc" id="fulldesc-plongee-${plongee.id}">${plongee.description}</td>
                <td>
                    <button class="btn btn-outline-secondary btn-danger deletePlongee" id="deletePlongee-${plongee.id}" type="button"><i class="bi bi-trash-fill"></i></button>
                </td>
            </tr>
            `

            if (plongee.description.length >= 50) {
                document.getElementById("shortdesc-plongee-" + plongee.id).addEventListener("mouseover", () => {
                    document.getElementById("shortdesc-plongee-" + plongee.id).style.display = "none";
                    document.getElementById("fulldesc-plongee-" + plongee.id).style.display = "block";
                    
                });
            }

            const editPlongees = document.getElementsByClassName("editPlongee");
            const deletePlongees = document.getElementsByClassName("deletePlongee");

            for (let i = 0; i < editPlongees.length; i++) {
                const id = editPlongees[i].id.split('-')[1];
                document.getElementById("editPlongee-" + id).addEventListener("click", () => {
                    const elem = document.getElementById("modal");
                    elem.classList = "modal shown Tmodal";
                    ajaxRequest("GET", "/modal/edit/plongee", showModal);
                })
            }

            for (let i = 0; i < deletePlongees.length; i++) {
                const id = deletePlongees[i].id.split('-')[1];
                document.getElementById("deletePlongee-" + id).addEventListener("click", () => {
                    document.getElementById("deletePlongee-" + id).parentNode.parentNode.remove();
                    ajaxRequest("DELETE", "/profil/delete/plongee", console.log, "plongee=" + id);
                });
            }

        }
        var tableRows = document.getElementsByClassName("plongee-row");
        for (let i = 0; i < tableRows.length; i++) {
            tableRows[i].addEventListener("mouseover", () => {
                const plongeeId = tableRows[i].id;
                $('#shortdesc-plongee-' + plongeeId).hide();
                $('#fulldesc-plongee-' + plongeeId).show();
                // TODO: Temporaire - affiche la description entière quand on clique (à faire sur hover plutôt)
            });

            tableRows[i].addEventListener("mouseout", () => {
                const plongeeId = tableRows[i].id;
                $('#shortdesc-plongee-' + plongeeId).show();
                $('#fulldesc-plongee-' + plongeeId).hide();
            });
        }
    }
}

function actualiserTags(data) {
    if ('tags' in data) {
        var tags = document.getElementsByName("add-tag-plongee")[0];
        tags.innerHTML = "";
        var content = `<option value="none" class=rounded-pill" value="none">Choisissez un tag à ajouter</option>`;
        for (let i = 0; i < data['tags'].length; i++) {
            const tag = data['tags'][i];
            content += `
            <option value="tag-${tag.id}.${tag.nom}.${tag.type}" class="tags badge bg-${tag.type}-subtle text-info-emphasis rounded-pill" onclick="ajoutTagAPlongee(${tag.id})">${tag.nom}</option>
            `
        }
        tags.innerHTML = content;

        tags.addEventListener("change", () => {
            const tags = document.getElementsByName("add-tag-plongee")[0];
            const tag = tags.value;
            if (tag != "none") {
                tagId = tag.split('.')[0];
                tagName = tag.split('.')[1];
                tagType = tag.split('.')[2];
                
                var activatedTags = document.getElementById("activated-tags-placement");
                var alreadyActivated = false;
    
                for (let i = 0; i < activatedTags.childNodes.length; i++) {
                    if (activatedTags.childNodes[i].id == (tagId)) {
                        alreadyActivated = true;
                    }
                }
                if (!alreadyActivated) {
                    var elem = document.createElement("span");
                    elem.classList = `badge bg-${tagType}-subtle text-info-emphasis rounded-pill`;
                    elem.innerHTML = tagName;
                    elem.id = tagId;
                    elem.addEventListener("click", () => {
                        elem.remove();
                    })
                    activatedTags.appendChild(elem);
                }
                tags.value = "none";
            }
        })
    }
}

function ajoutTag(data) {
    if ('tags' in data) {
        let elem = document.getElementsByName("add-tag-plongee")[0];
        elem.innerHTML += `<option value="tag-${data['tags'][0].id}.${data['tags'][0].nom}.${data['tags'][0].type}" class="tags badge bg-${data['tags'][0].type}-subtle text-info-emphasis rounded-pill" onclick="ajoutTagAPlongee(${data['tags'][0].id})">${data['tags'][0].nom}</option>`
    }
}

function ajoutTagAutomatique(data) {
    if ('tags' in data) {
        var content = "";
        for (let i = 0; i < data['tags'].length; i++) {
            content += data["tags"][i];
        }
        document.getElementById("automatic-tags-placement").innerHTML = content;
    }
}

function suppressionTagPlongee(id) {
    const elem = document.getElementById(id);
    elem.remove();
}


ajaxRequest("GET", "/profil/get/plongees", ajoutPlongeeTableau);