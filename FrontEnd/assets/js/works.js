function recupWorks(){
    fetch("http://localhost:5678/api/works")
    .then(reponse => reponse.json())
    .then(projects =>{
        console.log(projects);
        addWorks(projects);
        addFilters(projects)
    })
    .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

function addWorks(projects){
    const gallery = document.querySelector(".gallery");
    
    gallery.innerHTML = '';
    
    projects.forEach(work=>{
        const project = document.createElement("figure");
        
        const imageProject = document.createElement("img");
        imageProject.src = work.imageUrl;
        imageProject.alt = work.title;
        project.appendChild(imageProject); //Ajout de l'image à la balise figure
        
        const titleProject = document.createElement("figcaption");
        titleProject.textContent = work.title;
        project.appendChild(titleProject); //Ajout du titre à la balise figure

        gallery.appendChild(project); //Ajout de la balise figure à la div .gallery
    })
}

function addFilters(projects){
    const gallery = document.querySelector(".gallery");
    const filters = document.querySelector(".filters");

    //Récupère les id
    const idCategory = new Set(projects.map(id=>id.category.id));
    console.log(idCategory);

    //Récupère les names
    const nameCategory = new Set(projects.map(name=>name.category.name));
    console.log(nameCategory);

    //Créer les boutons
    nameCategory.forEach(buttonFilter=>{
        const filterContainer = document.createElement("div");
        filterContainer.classList.add("filterContainer");
    
        const filter = document.createElement("h3");
        filter.textContent = buttonFilter;
        filter.classList.add("filterTitle");
        filterContainer.appendChild(filter);

        filters.appendChild(filterContainer);
    })
}

recupWorks()