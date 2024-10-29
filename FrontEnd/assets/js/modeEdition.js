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
            goModalForm();
            returnModal();
            recupGallery();
            addPhoto();
            addCategories();
            sendForm();
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
    const iconClose = document.querySelectorAll(".icon-close");
    const modal = document.querySelectorAll(".modal");
    iconClose.forEach((icon, index)=>{
        icon.addEventListener('click', ()=>{
            modal[index].style.display = "none";
        })
    })
    window.addEventListener("click", (event) => {
        modal.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
}

function goModalForm(){
    const buttonCta = document.querySelector(".cta");
    const modalGallery = document.getElementById("modal-gallery");
    const modalForm = document.getElementById("modal-form");
    buttonCta.addEventListener('click', ()=>{
        modalGallery.style.display = "none";
        modalForm.style.display = "flex";
    })
}

function returnModal(){
    const iconReturn = document.querySelector(".icon-return");
    const modalGallery = document.getElementById("modal-gallery");
    const modalForm = document.getElementById("modal-form");
    iconReturn.addEventListener('click', ()=>{
        modalGallery.style.display = "flex";
        modalForm.style.display = "none";
    })
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

function addPhoto(){
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const fileInput = document.getElementById('fileInput');
    const iconImg = document.getElementById('icon-img');
    uploadPlaceholder.addEventListener('click', () => {
        // Déclencher le clic sur le champ de fichier
        fileInput.click();
      });
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
        // Utiliser FileReader pour lire le fichier image
        const reader = new FileReader();
        reader.onload = (e) => {
        // Remplacer l'icône par l'image sélectionnée
        iconImg.style.display = 'none'; // Masquer l'icône
        const img = document.createElement('img');
        img.classList.add("newImg")
        img.src = e.target.result;
        // Remplacer l'icône par l'image
        uploadPlaceholder.replaceChild(img, iconImg);
        };
        reader.readAsDataURL(file);
        }
    });      
}

function addCategories(){
    fetch('http://localhost:5678/api/categories')
        .then(reponse => reponse.json())
        .then(categories =>{
            console.log(categories);
            loadCategories(categories);
        })
        .catch(error => console.error("Error :", error))
}

function loadCategories(categories){
    const categorySelect = document.getElementById('photo-category');
    categories.forEach(category =>{
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    })
}

async function sendForm(){
    const buttonValid = document.querySelector(".cta-bis");
    buttonValid.addEventListener('click', async () =>{
        const fileInput = document.getElementById("fileInput");
        const title = document.getElementById("photo-title").value;
        const category = document.getElementById("photo-category").value;

        // Créer un objet FormData pour l'envoi
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', title);
        formData.append('category', category);

        // Envoyer la requête POST
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Fermer la modale et actualiser les données si nécessaire
                document.getElementById('modal-form').style.display = 'none';
                const newProject = await response.json();
                addProjectToIndex(newProject);
            } else {
                alert("Erreur lors de l'ajout du projet.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur de connexion.");
        }
    })
}

function addProjectToIndex(newProject){
    const gallery = document.querySelector(".gallery");

    const project = document.createElement("figure");
        
    const imageProject = document.createElement("img");
    imageProject.src = newProject.imageUrl;
    imageProject.alt = newProject.title;
    project.appendChild(imageProject); //Ajout de l'image à la balise figure
        
    const titleProject = document.createElement("figcaption");
    titleProject.textContent = newProject.title;
    project.appendChild(titleProject); //Ajout du titre à la balise figure

    gallery.appendChild(project); //Ajout de la balise figure à la div .gallery
}

addModeEdition();