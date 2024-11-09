import { recupWorks } from "./works.js";
import { recupCategory } from "./category.js";

/** Active le mode eddition **/
function addModeEdition(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const modeEdition = localStorage.getItem('modeEdition');
        if (modeEdition === "true"){
            console.log("mode édition activé");

            /**Ajout de la bannière**/
            const editBanner = document.querySelector(".banner");
            editBanner.style.display = "flex";

            const iconBanner = document.createElement("i");
            iconBanner.classList.add("fa-regular", "fa-pen-to-square");
            editBanner.appendChild(iconBanner);

            const textBanner = document.createElement("p");
            textBanner.classList.add("textBanner");
            textBanner.innerText = "Mode édition";
            editBanner.appendChild(textBanner);

            const headerSpace = document.querySelector(".header");
            headerSpace.style.marginTop = "90px";

            /**Remplacer login par logout**/
            const logout = document.querySelector(".login");
            logout.innerText = "logout";
            logout.addEventListener('click', () => {
                // Déconnexion et retour au mode normal
                localStorage.removeItem("modeEdition");
                location.reload();
            });
            
            /**Supprimer le trie**/
            const filters = document.querySelector(".filters");
            if (filters) {
                filters.style.display = "none";
            }

            /**Ajouter le bouton modifié**/
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
            addPhoto();
            sendForm();
        }
    })
}

/** Ouverture de la modale **/
function openModal(modifText){
    const modal = document.querySelector(".modal");
    modifText.addEventListener('click', ()=>{
        modal.style.display = "flex";
    })
}

/** Fermeture des modales **/
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

/** Aller vers la modale 2 **/
function goModalForm(){
    const buttonCta = document.querySelector(".cta");
    const modalGallery = document.getElementById("modal-gallery");
    const modalForm = document.getElementById("modal-form");
    buttonCta.addEventListener('click', ()=>{
        modalGallery.style.display = "none";
        modalForm.style.display = "flex";
    })
}

/** Retour vers la modale 1 **/
function returnModal(){
    const iconReturn = document.querySelector(".icon-return");
    const modalGallery = document.getElementById("modal-gallery");
    const modalForm = document.getElementById("modal-form");
    iconReturn.addEventListener('click', ()=>{
        modalGallery.style.display = "flex";
        modalForm.style.display = "none";
    })
}

/** Ajout dynamique des projets dans la modale 1 **/
function addGallery(projects){
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

/** Suppression des projets dans la modale 1 **/
async function deleteProject(deleteIcon, projectId, project) {
    deleteIcon.addEventListener("click", async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Erreur : aucun jeton trouvé. Veuillez vous connecter.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                console.log("Projet supprimé avec succès");
                project.remove(); // Supprime le projet de la modale
                removeProjectFromIndex(projectId); // Supprime le projet de la page index
            } else if (response.status === 401) {
                console.error("Erreur : non autorisé. Vérifiez le jeton.");
            } else {
                console.error("Erreur lors de la suppression du projet :", response.status);
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    });
}

/** Suppression des projets dans la page index **/
function removeProjectFromIndex(projectId) {
    // Utilise l'ID dynamique défini dans addWorks
    const project = document.querySelector(`#project-${projectId}`);
    console.log("Projet ciblé pour suppression :", project);

    if (project) {
        project.remove(); // Supprime le projet de la galerie
        console.log(`Projet avec ID ${projectId} supprimé de la page index`);
    } else {
        console.error(`Projet avec ID ${projectId} introuvable dans la galerie.`);
    }
}

const uploadPlaceholder = document.querySelector('.upload-placeholder');
const defaultPlaceholderContent = uploadPlaceholder.innerHTML;

/** Ajout de la photo **/
function addPhoto(){
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const fileInput = document.getElementById('fileInput');

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
        uploadPlaceholder.innerHTML = '';
        const img = document.createElement("img");
        img.classList.add("newImg")
        img.src = e.target.result;
        // Remplacer l'icône par l'image
        uploadPlaceholder.appendChild(img);
        };
        reader.readAsDataURL(file);
        }
    });      
}

/** Charge les catégories dans le menu déroulant **/
function loadCategories(categories){
    const categorySelect = document.getElementById('photo-category');

    categories.forEach(category =>{
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    })

    const options = categorySelect.querySelectorAll('option');
    options.forEach(option => {
        if (option.textContent === "Tous") {
            option.remove();
        }
    });
}

/** Soumission du nouveau projet **/
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
                document.getElementById('modal-form').style.display = 'none';
                const newProject = await response.json();
                addProjectToIndex(newProject);

                document.getElementById("photo-title").value = '';
                document.getElementById("photo-category").value = '';
                fileInput.value = '';

                uploadPlaceholder.innerHTML = defaultPlaceholderContent;
            } else {
                const title = document.getElementById("title-modal");
                const errorMessage = document.createElement("p");
                errorMessage.classList.add("errorMessage");
                errorMessage.textContent = "Veuillez remplir tous les champs.";
                title.insertAdjacentElement("afterend", errorMessage);
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur de connexion.");
        }
    })
}


/** Ajout du nouveau projet dans la page index **/
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

/** Active le bouton de validation **/
function checkFormCompletion() {
    const fileInput = document.getElementById('fileInput').files[0];
    const title = document.getElementById('photo-title').value;
    const category = document.getElementById('photo-category').value;
    const buttonValid = document.querySelector(".cta-bis");

    // Vérifier que tous les champs sont remplis
    if (fileInput && title && category) {
        buttonValid.classList.add('active');
    } else {
        buttonValid.classList.remove('active');
    }
}

document.getElementById('fileInput').addEventListener('change', checkFormCompletion);
document.getElementById('photo-title').addEventListener('input', checkFormCompletion);
document.getElementById('photo-category').addEventListener('change', checkFormCompletion);

addModeEdition();
recupWorks("http://localhost:5678/api/works", addGallery);
recupCategory("http://localhost:5678/api/categories", loadCategories);