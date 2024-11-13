import { allProject } from "./works.js";
import { addWorks } from "./works.js";


/** Récupération des données API des catégories **/
export function recupCategory(linkApi, callback){
    fetch(linkApi)
    .then(reponse => reponse.json())
    .then(categories =>{
        console.log(categories);
        callback(categories);
    })
    .catch(error => console.error("Erreur lors de la récupération des projets:", error));
}

/** Ajout des filtres dans la page index **/
function addFilter(categories){
    categories.unshift({id : 4, name : "Tous"});
    console.log(categories);

    const filters = document.querySelector(".filters");

    categories.forEach(buttonFilter => {
        const filterContainer = document.createElement("div");
        filterContainer.classList.add("filterContainer");

        const filterCategory = document.createElement("h3");
        filterCategory.textContent = buttonFilter.name;
        filterCategory.classList.add("filterTitle");
        filterContainer.appendChild(filterCategory);

        filters.appendChild(filterContainer);

        filterContainer.addEventListener('click', () => {
            console.log("Vous avez appuyé sur un bouton filtre");
            showFilter(filterContainer);
            filterUpdate(filterContainer);
        }); 
        
        const defaultFilter = filters.querySelector(".filterContainer");
        defaultFilter.classList.add("active");
        showFilter(defaultFilter);
    });
}


/** Affiche les projets en fonction de la catégorie sélectionnée **/
function showFilter(clickedElement){
    const selectedCategory = clickedElement.querySelector('.filterTitle').textContent;
    
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; 
    
    let filteredProjects;

    if (selectedCategory === "Tous") {
        filteredProjects = allProject;
    } else {
        filteredProjects = allProject.filter(project => project.category.name === selectedCategory);
    }
    addWorks(filteredProjects);
}

/** Met à jour le filtre actif en appliquant la classe "active" au filtre sélectionné **/
function filterUpdate(clickedElement){
    const filter = document.querySelectorAll(".filterContainer");

    filter.forEach(filterSelect =>{
        filterSelect.classList.remove("active");
    });

    clickedElement.classList.add("active");
}

recupCategory("http://localhost:5678/api/categories", addFilter);