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

            openModal(modifText);
            closeModal();
            recupGallery();
        }
    })
}

function openModal(modifText){
    const modal = document.querySelector(".modal");
    modifText.addEventListener('click', ()=>{
        modal.style.display = "flex";
    })
}

function closeModal(){
    const iconClose = document.querySelector(".icon-close");
    const modal = document.querySelector(".modal");
    iconClose.addEventListener('click', ()=>{
        modal.style.display = "none";
    })
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

function recupGallery(){
    fetch("http://localhost:5678/api/works")
    .then(reponse => reponse.json())
    .then(projects =>{
        console.log(projects);
        addGalery(projects);
    })
    .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

function addGalery(projects){
    const galleryProject = document.querySelector(".gallery-project");

    projects.forEach(work =>{
        const project = document.createElement("figure");
        project.classList.add("figureModal");
        project.setAttribute("data-id", work.id);

        const imgProject = document.createElement("img");
        imgProject.classList.add("imgModal")
        imgProject.src = work.imageUrl;
        imgProject.alt = work.title;
        project.appendChild(imgProject);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
        project.appendChild(deleteIcon);

        deleteProject(deleteIcon, work.id, project);

        galleryProject.appendChild(project);
    })
}

function deleteProject(deleteIcon, projectId, project){
    deleteIcon.addEventListener("click", () => {
        const token = localStorage.getItem("token"); // Récupère le jeton stocké

        if (!token) {
            console.error("Erreur : aucun jeton trouvé. Veuillez vous connecter.");
            return;
        }

        fetch(`http://localhost:5678/api/works/${projectId}`, {  // URL de suppression
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`  // En-tête avec le jeton pour prouver l'autorisation
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Projet supprimé avec succès");
                project.remove(); // Supprime le projet du DOM
                const projectInIndex = document.querySelector(`.gallery [data-id='${projectId}']`);
                if (projectInIndex) {
                    projectInIndex.remove();
                    console.log(`Projet avec ID ${projectId} supprimé de la page index`);
                }
            } else if (response.status === 401) {
                console.error("Erreur : non autorisé. Vérifiez le jeton.");
            } else {
                console.error("Erreur lors de la suppression du projet :", response.status);
            }
        })
        .catch(error => console.error("Erreur réseau :", error));
    });
}

addModeEdition();