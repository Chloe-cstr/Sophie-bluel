function addModeEdition(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const modeEdition = localStorage.getItem('modeEdition')
        if (modeEdition === "true"){
            console.log("mode édition activé");

            //Ajout de la bannière
            const editBanner = document.querySelector(".banner");

            const iconBanner = document.createElement("i");
            iconBanner.classList.add("fa-regular", "fa-pen-to-square");
            editBanner.appendChild(iconBanner);

            const textBanner = document.createElement("p");
            textBanner.classList.add("textBanner");
            textBanner.innerText = "Mode édition";
            editBanner.appendChild(textBanner);

            //Remplacer login par logout
            const logout = document.querySelector(".login");
            logout.innerText = "logout";
            
            //Supprimer le trie
            const filters = document.querySelector(".filters");
            if (filters) {
                filters.style.display = "none";
            }

            //Ajouter le bouton modifié
            const title = document.querySelector("#portfolio h2");

            const titleContainer = document.createElement("div");
            titleContainer.classList.add("titleContainer");

            title.parentNode.insertBefore(titleContainer, title);
            titleContainer.appendChild(title);

            const modifIcon = document.createElement("i");
            modifIcon.classList.add("fa-regular", "fa-pen-to-square", "modifIcon");
            titleContainer.appendChild(modifIcon);

            const modifText = document.createElement("a");
            modifText.classList.add("modifText")
            modifText.innerText = "modifier";
            titleContainer.appendChild(modifText);
        }
    })
}

addModeEdition()