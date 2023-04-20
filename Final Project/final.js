var mario = document.getElementById("perso1");
var luigi = document.getElementById("perso2");
var toad = document.getElementById("perso3");

// on crée la fonction qui va lancer le jeu 

function startgame(character) {
    if (character === "mario") {
        //setup for mario
        window.open("mario.html", "_self");
    }
    else if (character === "luigi") {
        //setup for luigi
    }
    else if (character === "toad") {
        //setup for toad
    }
    console.log("Vous avez cliqué sur " + character);
}

// on lance la fonction pour chaque perso 

mario.addEventListener("click", function () {
    startgame("mario")
});

luigi.addEventListener("click", function () {
    startgame("mario")
});

toad.addEventListener("click", function () {
    startgame("mario")
});