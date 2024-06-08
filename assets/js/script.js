addEventListener("DOMContentLoaded", () => {
    ajaxRequest("GET", "/profil/get", displayPageAdaptedForUser);
});