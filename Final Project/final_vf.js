// Exemple de code JavaScript
const player = document.getElementById('player');
const colorbutton = document.getElementById('colorbutton');
const shapebutton = document.getElementById('shapebutton');
const playbutton = document.getElementById('playbutton');
const gravity = 0.5 //pour plus de réalisme, on rajoute une accélération
const sol_y = 500;
let startTime;
let elapsedtime = 0;


// Tableau pour stocker les différentes formes possibles
const shapes = ['square', 'circle', 'triangle', 'diamond', 'star'];

// Variable pour stocker l'index de la forme actuelle
let currentShapeIndex = 0;
let currentColor = 'rgb(255, 0, 0)'
let currentShape = shapes[currentShapeIndex];

// Fonction pour changer la couleur du carré
function changeColor() {
    // Générer une couleur aléatoire en format RGB
    currentColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    // Appliquer la couleur aléatoire au carré
    player.style.backgroundColor = currentColor;

}

function changeShape() {
    console.log('you clicked on shapebutton');
    // Récupérer la prochaine forme dans le tableau des formes
    currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
    console.log(currentShapeIndex)
    currentShape = shapes[currentShapeIndex];
    console.log(currentShape)
    player.className = '';

    switch (currentShape) {
        case 'circle':
            // player.style.borderRadius = '50%';
            player.style.clipPath = 'circle(50% at 50% 50%)'
            break;
        case 'triangle':
            //player.style.borderTopLeftRadius = '100%';
            player.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            break;
        case 'diamond':
            //player.style.transform = 'rotate(45deg)'; 
            player.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
            break;
        case 'star':
            player.style.clipPath = 'polygon(50% 0%, 64% 36%, 100% 39%, 72% 64%, 80% 100%, 50% 80%, 20% 100%, 28% 64%, 0% 39%, 36% 36%)';
            break;
        default: // Par défaut, carré
            player.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
            break;
    }
    // Mettre à jour la classe CSS pour la transition
    // player.classList.add(`shape-${nextShape}`);
}

// Écouter l'événement de clic sur le bouton 
colorbutton.addEventListener('click', changeColor);
shapebutton.addEventListener('click', changeShape);


var c;
var canvas;

//fonction qui démarre le jeu en ouvrant un canvas
function play() {
    // Créer un élément canvas
    canvas = document.createElement("canvas");
    c = canvas.getContext('2d');
    startTime = Date.now();

    // Définir la largeur et la hauteur du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Ajouter le canvas à un conteneur spécifique
    var canvasContainer = document.getElementById("myCanvas");
    canvasContainer.appendChild(canvas);

    // Appliquer un effet "deck slide" (par exemple, faire défiler jusqu'au conteneur)
    var containerOffsetTop = canvasContainer.offsetTop;
    window.scrollTo({ top: containerOffsetTop, behavior: 'smooth' });

    // drawShapes();
    animate() //il faut mettre animate à l'intérieur de cette boucle car sinon les variable c et canvas ne sont pas définies
    console.log(realplayer)
}

//on démarre le jeu en cliquant sur le bouton play
playbutton.addEventListener("click", play);

//On construit une classe où on a des formes (carré, triangle, etc...)
class Shape {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.angle = 0;
        this.width = 30;
        this.height = 30;
        this.velocity = { x: 0, y: 10 };
    }

    //on dessine notre objet qu'on appelle this
    draw() {
        //c.translate(this.position.x, this.position.y); // Translation vers la position x, y
        c.rotate(this.angle); // Rotation selon l'angle actuel
        switch (currentShape) {
            case 'circle':
                c.fillStyle = currentColor;
                c.beginPath();
                c.arc(this.position.x + 15, this.position.y + 15, 15, 0, Math.PI * 2);
                c.closePath();
                c.fill();
                break;
            case 'triangle':
                c.fillStyle = currentColor;
                c.beginPath();
                c.moveTo(this.position.x, this.position.y + 30);
                c.lineTo(this.position.x + 30, this.position.y + 30);
                c.lineTo(this.position.x + 15, this.position.y);
                c.closePath();
                c.fill();
                break;
            case 'diamond':
                c.fillStyle = currentColor;
                c.beginPath();
                c.moveTo(this.position.x + 15, this.position.y - 10);
                c.lineTo(this.position.x + 30, this.position.y + 10);
                c.lineTo(this.position.x + 15, this.position.y + 30);
                c.lineTo(this.position.x, this.position.y + 10)
                c.closePath();
                c.fill();
                break;
            case 'star':
                c.fillStyle = currentColor;
                c.beginPath();
                var angle = (Math.PI * 2) / 10; // Utiliser 10 pour un cercle avec 5 pointes
                var innerRadius = 6; // Rayon intérieur de l'étoile
                var outerRadius = 15; // Rayon extérieur de l'étoile
                var cx = this.position.x + 15; // Coordonnée x du centre de l'étoile
                var cy = this.position.y + 15; // Coordonnée y du centre de l'étoile
                for (var i = 0; i < 10; i++) {
                    var radius = i % 2 === 0 ? outerRadius : innerRadius;
                    var x = Math.cos(i * angle) * radius + cx;
                    var y = Math.sin(i * angle) * radius + cy;
                    if (i === 0) {
                        c.moveTo(x, y);
                    } else {
                        c.lineTo(x, y);
                    }
                }
                c.closePath();
                c.fill();
                break;
            default: // Par défaut, carré
                c.fillStyle = currentColor;
                c.fillRect(this.position.x, this.position.y, this.width, this.height);
                break;
        }
    }

    //on fait une fonction update pour changer la vitesse au cours du temps
    update() {
        this.position.y += this.velocity.y
        this.velocity.y += gravity //pour plus de réalisme on ajoute l'accélération 
        this.position.x += this.velocity.x
        this.draw()
        if (this.position.y + this.height + this.velocity.y <= canvas.height) this.velocity.y += gravity
        else this.velocity.y = 0 //le carré s'arrête quand il atteint le sol
    }

    rotate() {
        this.angle += Math.PI / 2; // Rotation de 90 degrés
    }
}

//on prend un joueur (c'est un objet de notre classe Shape)
const realplayer = new Shape()

//on crée une classe de plateformes
class Platform {
    constructor({ x, y }, w, h, isFixed = false) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = w;
        this.height = h;
        this.isFixed = isFixed;
    }

    setColor(color) { this.color = color }

    draw(color) {
        c.fillStyle = color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


const platforms = [new Platform({ x: 0, y: sol_y }, window.innerWidth, 15, true), new Platform({ x: 50, y: 300 }, 100, 15), new Platform({ x: 200, y: 100 }, 100, 15), new Platform({ x: 500, y: 200 }, 100, 15)]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate)
    const currentTime = Date.now()
    elapsedtime = (currentTime - startTime) / 1000 //temps en secondes 
    const elapsedtime_string = elapsedtime.toFixed(2); //on ne prend que 3 chiffres significatifs 
    c.clearRect(0, 0, canvas.width, canvas.height) //on souhaite supprimer les images précédentes au cours du temps
    platforms.forEach((platform) => {
        if (keys.right.pressed && realplayer.position.x < 500) { realplayer.velocity.x = 5 }
        else if (keys.left.pressed && realplayer.position.x > 50) { realplayer.velocity.x = -5 }
        else {
            realplayer.velocity.x = 0
            // le && permet de garder les plateformes avec la propriété fixe fixes
            if (keys.right.pressed && platform.isFixed == false) {
                platform.position.x -= 5
            }
            if (keys.left.pressed && platform.isFixed == false) {
                platform.position.x += 5
            }
        }
        if (realplayer.position.y + realplayer.height <= platform.position.y && realplayer.position.y + realplayer.height + realplayer.velocity.y >= platform.position.y && platform.position.x <= realplayer.position.x + realplayer.width && realplayer.position.x <= platform.position.x + platform.width) { realplayer.velocity.y = 0 } //platform collision detection
    })

    realplayer.update()
    platforms.forEach((platform) => { platform.draw('red') })
    platforms[0].draw('green');

    // Afficher le temps écoulé sur le canvas
    c.fillStyle = 'black';
    c.font = '24px TimesNewRoman';
    c.fillText(`Time: ${elapsedtime_string} s`, 1000, 130); // Afficher le temps en secondes
}



window.addEventListener('keydown', ({ keyCode }) => { //keydown signifie lorsque l'on presse une touche 
    // console.log(keyCode) //ça m"écrit le keyCode dans la console
    switch (keyCode) {
        case 32:
            console.log('up')
            realplayer.velocity.y -= 20
            break
        case 40:
            console.log('down')
            break
        case 37:
            console.log('left')
            keys.left.pressed = true;
            break
        case 39:
            console.log('right')
            keys.right.pressed = true;
            break
    }
})

document.addEventListener("keydown", function (event) {
    if (event.keyCode === 32) { // Vérifier si la touche enfoncée est la touche espace (code 32)
        event.preventDefault();
    }
})


addEventListener('keyup', ({ keyCode }) => { //keyup signifie lorsque l'on ne presse pas une touche 
    switch (keyCode) {
        case 32:
            console.log('up')
            realplayer.velocity.y -= 0
            break
        case 40:
            console.log('down')
            break
        case 37:
            console.log('left')
            keys.left.pressed = false;
            break
        case 39:
            console.log('right')
            keys.right.pressed = false;
            break
    }
})
