function recupCategory(){
    fetch("http://localhost:5678/api/categories")
    .then(reponse => reponse.json())
    .then(categories =>{
        console.log(categories);
        addFilter(categories)
    })
    .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

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
    });
}

function showFilter(clickedElement){
    clickedElement.classList.toggle('active');
    const selectedCategory = clickedElement.querySelector('.filterTitle').textContent;

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';  
    
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(projects => {
        // Filtrer les projets en fonction de la catégorie sélectionnée
        let filteredProjects;

        if (selectedCategory === "Tous") {
            // Si le bouton "Tous" est sélectionné, on affiche tous les projets
            filteredProjects = projects;
        } else {
            // Sinon, on filtre par catégorie
            filteredProjects = projects.filter(project => project.category.name === selectedCategory);
        }

        // Ensuite, on réaffiche les projets filtrés
        addWorks(filteredProjects);
    })
    .catch(error => console.error('Erreur lors de la récupération des projets:', error));
    
}

function filterUpdate(clickedElement){
    const filter = document.querySelectorAll(".filterContainer");

    //Supprimer la classe active de tous les filtres
    filter.forEach(filterSelect =>{
        filterSelect.classList.remove("active");
    });

    //Ajouter la classe active sur le filtre actif
    clickedElement.classList.add("active");
}

recupCategory();