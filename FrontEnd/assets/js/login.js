/** Empêche l'envoi par défaut et déclenche la fonction recupLogin avec les valeurs de l'email et du mot de passe **/
let form = document.querySelector("form");
form.addEventListener('submit', function(event){
    event.preventDefault(); 
    console.log("Formulaire soumis");
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    recupLogin(email,password)
})

/** Gère la connexion de l'utilisateur **/
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
        console.log(data); 
        if (data.token) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('modeEdition', 'true'); 
            window.location.href = 'index.html'; 
        } 
    })
    .catch(error => {
        const errorElement = document.querySelector(".error");

        errorElement.innerHTML = '';

        const errorIcon = document.createElement("i");
        errorIcon.classList.add("fa-solid", "fa-triangle-exclamation");
        errorElement.appendChild(errorIcon);

        const errorMessage = document.createElement("p")
        errorMessage.classList.add("errorMessage");
        errorMessage.textContent = "Email ou mot de passe incorrect.";
        errorElement.appendChild(errorMessage);
    });
}