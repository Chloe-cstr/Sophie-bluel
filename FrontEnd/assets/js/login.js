let form = document.querySelector("form");
form.addEventListener('submit', function(event){
    event.preventDefault(); // Empêche l’envoi quel que soit le moyen de soumission
    console.log("Formulaire soumis");
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    recupLogin(email,password)
})

function recupLogin(email, password){
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(reponse =>{
        if (!reponse.ok) {
            throw new Error('Erreur lors de la connexion');
        }
        return reponse.json();
    })
    .then(data => {
        console.log(data); // Afficher la réponse pour voir la structure
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('modeEdition', 'true'); // Mode édition activé
            window.location.href = 'index.html'; // Redirection en cas de succès
        } 
    })
    .catch(error => {
        const errorElement = document.querySelector(".error");

        const errorIcon = document.createElement("i");
        errorIcon.classList.add("fa-solid", "fa-triangle-exclamation");
        errorElement.appendChild(errorIcon);

        const errorMessage = document.createElement("p")
        errorMessage.classList.add("errorMessage");
        errorMessage.textContent = "Email ou mot de passe incorrect.";
        errorElement.appendChild(errorMessage);
    });
}