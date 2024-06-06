function afficherModalPlongee(data) {
    // Ajout de l'élément modal à la bonne position.
    let elem = document.getElementById("modal");
    elem.classList = "modal shown Tmodal";
    appendToPage(data, "modal");

    var tags = document.getElementsByName("add-tag-plongee")[0];
    var content = "";
    for (let i = 0; i < data['tags'].length; i++) {
        const tag = data['tags'][i];
        console.log(tag);
        content += `
        <option value="tag-${tag.id}.${tag.nom}.${tag.type}" class="tags badge bg-${tag.type}-subtle text-info-emphasis rounded-pill" onclick="ajoutTagAPlongee(${tag.id})">${tag.nom}</option>
        `
    }
    tags.innerHTML = content;
    tags.addEventListener("change", () => {
        const tag = document.getElementsByName("add-tag-plongee")[0].value;
        console.log(tag);
        tagId = tag.split('.')[0];
        tagName = tag.split('.')[1];
        tagType = tag.split('.')[2];
        
        var activatedTags = document.getElementById("activated-tags-placement");
        var alreadyActivated = false;

        for (let i = 0; i < activatedTags.childNodes.length; i++) {
            if (activatedTags.childNodes[i].id == ("tag-" + tagId)) {
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
    })

    const elemTags = document.getElementsByClassName("tags");

    // Ajout du "mini-formulaire" pour ajouter un tag.
    document.getElementById("btn-add-tag").addEventListener("click", () => {
        console.log("add tag!");
        const name = document.getElementsByName("tag-name")[0].value;
        const type = document.getElementsByName("tag-type")[0].value;
        ajaxRequest("PUT", "/profil/add/tag", ajoutTagAutomatique, "nom=" + name + "&type=" + type);
    })


    // Ajout du bouton pour fermer le modal.
    let buttonClose = document.getElementById("closeModal");
    buttonClose.addEventListener("click", () => {
        elem.classList = "modal hidden Tmodal";
    });

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
            console.log(activatedTags.childNodes[i].id.split("-"));
            tagsId.push(activatedTags.childNodes[i].id.split("-")[1]);
        }

        var note = 0;
        const jour = document.getElementsByName("jour")[0].value;

        for (let i = 0; i < elemNote.length; i++) {
            if (elemNote[i].checked == true) {
                note = elemNote[i].value;
            }
        }

        ajaxRequest("PUT", "/profil/add/plongee", console.log, "volume=" + volume + "&pression=" + pression + "&profondeur=" + profondeur + "&jour=" + jour + "&duree=" + duree + "&note=" + note + "&description=" + description + "&tags=" + tagsId);
        ajaxRequest("GET", "/profil/get/plongees", ajoutPlongeeTableau);
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
                console.log(tag);
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
            </tr>
            `

            if (plongee.description.length >= 50) {
                document.getElementById("shortdesc-plongee-" + plongee.id).addEventListener("mouseover", () => {
                    document.getElementById("shortdesc-plongee-" + plongee.id).style.display = "none";
                    document.getElementById("fulldesc-plongee-" + plongee.id).style.display = "block";
                    
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