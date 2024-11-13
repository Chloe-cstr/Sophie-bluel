export let allProject = [];

/** Récupération des projets à partir d'une API **/
export function recupWorks(linkApi, callback){
    fetch(linkApi)
    .then(reponse => reponse.json())
    .then(projects =>{
        allProject = projects;
        console.log(allProject);
        callback(projects);
    })
    .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

/** Ajout dynamiquement des projets dans la page index **/
export function addWorks(projects){
    const gallery = document.querySelector(".gallery");
    
    gallery.innerHTML = '';
    
    projects.forEach(work=>{
        const project = document.createElement("figure");
        project.id = `project-${work.id}`;
        console.log(`ID du projet : ${project.id}`);
        
        const imageProject = document.createElement("img");
        imageProject.src = work.imageUrl;
        imageProject.alt = work.title;
        project.appendChild(imageProject); 
        
        const titleProject = document.createElement("figcaption");
        titleProject.textContent = work.title;
        project.appendChild(titleProject); 

        gallery.appendChild(project); 
    })
}

recupWorks("http://localhost:5678/api/works", addWorks);
