// Exemple de code JavaScript
const player = document.getElementById('player');
const colorbutton = document.getElementById('colorbutton');
const shapebutton = document.getElementById('shapebutton');
const playbutton = document.getElementById('playbutton');
const gravity = 0.5 //pour plus de réalisme, on rajoute une accélération
const sol_y = 500;
let scores = [];
let startTime;
let elapsedtime = 0;
let finish_time = 0;
let scrollOffset = 0;
let player_speed = 10;

const platformImage = new Image();
platformImage.src = 'https://raw.githubusercontent.com/chriscourses/mario-game/main/src/img/lgPlatform.png'

const hillsImage = new Image();
hillsImage.src = 'hills.png'

const skyImage = new Image();
skyImage.src = 'sky.jpg'

const arrivalImage = new Image();
arrivalImage.src = 'arrival.png'

const winImage = new Image();
winImage.src = 'win.png'

const replayImage = new Image();
replayImage.src = 'replay.png'

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

const Imagewidth = winImage.width
const Imageheight = winImage.height
const compteur = 0;


//fonction qui démarre le jeu en ouvrant un canvas
function play() {
    // Créer un élément canvas
    canvas = document.createElement("canvas");
    c = canvas.getContext('2d');

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
let realplayer = new Shape()

//on crée une classe de plateformes
class Platform {
    constructor({ x, y }, w, h, isFixed = false) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = platformImage.width;
        this.height = platformImage.height;
        this.isFixed = isFixed;
    }

    setColor(color) { this.color = color }

    draw(color) {
        c.drawImage(platformImage, this.position.x, this.position.y)
    }
}

let platforms = [new Platform({ x: 0, y: sol_y }, window.innerWidth, 15, true), new Platform({ x: platformImage.width - 3, y: sol_y }, 100, 15, true), new Platform({ x: 0.5 * platformImage.width, y: 350 }, 200, 15, false), new Platform({ x: 0.8 * platformImage.width, y: 200 }, 150, 15, false), new Platform({ x: 1.8 * platformImage.width, y: 250 }, 330, 15, false), new Platform({ x: 2.8 * platformImage.width, y: 300 }, 100, 15, false), new Platform({ x: 3.8 * platformImage.width, y: 350 }, 100, 15, false), new Platform({ x: 4.8 * platformImage.width, y: 400 }, 100, 15, false)]

//on crée une classe d'objets
class GenericObjects {
    constructor({ x, y }, w, h, isFixed = false) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = hillsImage.width;
        this.height = hillsImage.height;
    }

    draw() {
        c.drawImage(hillsImage, this.position.x, this.position.y)
    }
}

let hills = [new GenericObjects({ x: 0, y: sol_y }, window.innerWidth, 15, false), new GenericObjects({ x: 100, y: 200 }, 100, 15, false)]

//on crée une classe pour le ciel
class sky {
    constructor({ x, y }, w, h, isFixed = false) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = skyImage.width;
        this.height = skyImage.height;
    }

    draw() {
        c.drawImage(skyImage, this.position.x, this.position.y)
    }
}

let skys = [new sky({ x: 0, y: 0 }, window.innerWidth, 15, false), new sky({ x: skyImage.width + 200, y: 0 }, window.innerWidth, 15, false), new sky({ x: 2 * skyImage.width, y: 0 }, window.innerWidth, 15, false)]

class Arrival {
    constructor() {
        this.position = { x: 30000, y: 250 };
        this.velocity = { x: 0, y: 0 };
        this.width = arrivalImage.width;
        this.height = arrivalImage.height;
    }

    draw() {
        c.drawImage(arrivalImage, this.position.x, this.position.y)
    }
}

let arrival = new Arrival()

class Winning {
    constructor() {
        this.position = { x: 600, y: 150 }
    }
    draw() {
        c.drawImage(winImage, this.position.x, this.position.y)
    }

    getbigger() {
        if (Imagewidth < 2 * winning.width && compteur === 0) { Imagewidth += 5 } else if (Imagewidth >= 2 * winning.width || compteur === 1) { Imagewidth -= 5; compteur = 1 } else if (Imagewidth < winning.width) { Imagewidth += 5; compteur = 0 }
    }
}

let winning = new Winning()

class Replay {
    constructor() {
        this.position = { x: 900, y: 50 }
    }
    draw() {
        c.drawImage(replayImage, this.position.x, this.position.y)
    }
}


let replay = new Replay()

let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

//fonction pour restart le game
function init() {

    scrollOffset = 0;

    //je réinitialise l'état des touches
    keys.left.pressed = false;
    keys.right.pressed = false;

    class Shape {
        constructor() {
            this.position = { x: 100, y: 100 };
            this.angle = 0;
            this.width = 30;
            this.height = 30;
            this.velocity = { x: -10, y: 10 };
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
    realplayer = new Shape()

    //on crée une classe de plateformes
    class Platform {
        constructor({ x, y }, w, h, isFixed = false) {
            this.position = { x, y };
            this.velocity = { x: 0, y: 0 };
            this.width = platformImage.width;
            this.height = platformImage.height;
            this.isFixed = isFixed;
        }

        setColor(color) { this.color = color }

        draw(color) {
            c.drawImage(platformImage, this.position.x, this.position.y)
        }
    }

    platforms = [new Platform({ x: 0, y: sol_y }, window.innerWidth, 15, true), new Platform({ x: platformImage.width - 3, y: sol_y }, 100, 15, true), new Platform({ x: 0.5 * platformImage.width, y: 350 }, 200, 15, false), new Platform({ x: 0.8 * platformImage.width, y: 200 }, 150, 15, false), new Platform({ x: 1.8 * platformImage.width, y: 250 }, 330, 15, false), new Platform({ x: 2.8 * platformImage.width, y: 300 }, 100, 15, false), new Platform({ x: 3.8 * platformImage.width, y: 350 }, 100, 15, false), new Platform({ x: 4.8 * platformImage.width, y: 400 }, 100, 15, false)]

    //on crée une classe d'objets
    class GenericObjects {
        constructor({ x, y }, w, h, isFixed = false) {
            this.position = { x, y };
            this.velocity = { x: 0, y: 0 };
            this.width = hillsImage.width;
            this.height = hillsImage.height;
        }

        draw() {
            c.drawImage(hillsImage, this.position.x, this.position.y)
        }
    }

    hills = [new GenericObjects({ x: 0, y: sol_y }, window.innerWidth, 15, false), new GenericObjects({ x: 100, y: 200 }, 100, 15, false)]

    //on crée une classe pour le ciel
    class sky {
        constructor({ x, y }, w, h, isFixed = false) {
            this.position = { x, y };
            this.velocity = { x: 0, y: 0 };
            this.width = skyImage.width;
            this.height = skyImage.height;
        }

        draw() {
            c.drawImage(skyImage, this.position.x, this.position.y)
        }
    }

    skys = [new sky({ x: 0, y: 0 }, window.innerWidth, 15, false), new sky({ x: skyImage.width + 200, y: 0 }, window.innerWidth, 15, false), new sky({ x: 2 * skyImage.width, y: 0 }, window.innerWidth, 15, false)]

    class Arrival {
        constructor() {
            this.position = { x: 30000, y: 250 };
            this.velocity = { x: 0, y: 0 };
            this.width = arrivalImage.width;
            this.height = arrivalImage.height;
        }

        draw() {
            c.drawImage(arrivalImage, this.position.x, this.position.y)
        }
    }

    arrival = new Arrival()

    class Winning {
        constructor() {
            this.position = { x: 600, y: 150 }
        }
        draw() {
            c.drawImage(winImage, this.position.x, this.position.y)
        }

        getbigger() {
            if (Imagewidth < 2 * winning.width && compteur === 0) { Imagewidth += 5 } else if (Imagewidth >= 2 * winning.width || compteur === 1) { Imagewidth -= 5; compteur = 1 } else if (Imagewidth < winning.width) { Imagewidth += 5; compteur = 0 }
        }
    }

    winning = new Winning()

    class Replay {
        constructor() {
            this.position = { x: 600, y: 150 }
        }
        draw() {
            c.drawImage(replay, this.position.x, this.position.y)
        }
    }


    let replay = new Replay()

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

}

function animate() {
    requestAnimationFrame(animate)
    if (scrollOffset === 0 && keys.right.pressed) {
        startTime = Date.now()
    }
    let currentTime = Date.now()
    elapsedtime = (currentTime - startTime) / 1000
    if (scrollOffset === 0 && !keys.right.pressed) { elapsedtime = 0 } //temps en secondes 

    let elapsedtime_string = elapsedtime.toFixed(2); //on ne prend que 3 chiffres significatifs 
    c.clearRect(0, 0, canvas.width, canvas.height) //on souhaite supprimer les images précédentes au cours du temps
    platforms.forEach((platform) => {
        if (keys.right.pressed && realplayer.position.x < 500 && scrollOffset < 30000) { realplayer.velocity.x = player_speed }
        else if (keys.left.pressed && realplayer.position.x > 50 && scrollOffset < 30000) { realplayer.velocity.x = -player_speed }
        else {
            realplayer.velocity.x = 0
            // le && permet de garder les plateformes avec la propriété fixe fixes
            if (keys.right.pressed && platform.isFixed == false && scrollOffset < 30000) {
                platform.position.x -= player_speed
                hills.forEach((GenericObjects) => { GenericObjects.position.x -= player_speed * 0.6 })
                skys.forEach((sky) => { sky.position.x -= player_speed * 0.1 })
                arrival.position.x -= player_speed
                scrollOffset += player_speed
            }
            if (keys.left.pressed && platform.isFixed == false && scrollOffset < 30000) {
                platform.position.x += player_speed
                hills.forEach((GenericObjects) => { GenericObjects.position.x += player_speed * 0.6 })
                skys.forEach((sky) => { sky.position.x += player_speed * 0.1 })
                arrival.position.x += player_speed
                // console.log(platform.position.x)
                scrollOffset -= player_speed
            }
        }
        if (realplayer.position.y + realplayer.height <= platform.position.y && realplayer.position.y + realplayer.height + realplayer.velocity.y >= platform.position.y && platform.position.x <= realplayer.position.x + realplayer.width && realplayer.position.x <= platform.position.x + platform.width) { realplayer.velocity.y = 0 } //platform collision detection
        if (scrollOffset === 30000) {
            console.log('you win in:' + elapsedtime_string + 's'); realplayer.velocity.x = 0; realplayer.position.x = arrivalImage.width / 2; arrival.position.x = 0; winning.draw(); winning.getbigger(); finish_time = elapsedtime_string; scrollOffset++
        }
        else if (scrollOffset > 30000) { realplayer.velocity.x = 0; realplayer.position.x = arrivalImage.width / 2; arrival.position.x = 0; winning.draw(); winning.getbigger(); replay.draw() }
        // console.log(scrollOffset)
    })

    skys.forEach((sky) => { sky.draw() })
    hills.forEach((GenericObjects) => { GenericObjects.draw() })
    platforms.forEach((platform) => { platform.draw('red') })
    arrival.draw()
    realplayer.update()

    // Afficher le temps écoulé sur le canvas
    if (scrollOffset < 30000) {
        c.fillStyle = 'black';
        c.font = '24px TimesNewRoman';
        c.fillText(`Time: ${elapsedtime_string} s`, 1000, 130); // Afficher le temps en secondes
    }
    else {
        c.fillStyle = 'black';
        c.font = '24px TimesNewRoman';
        c.fillText(`Final time: ${finish_time} s`, 1000, 130);
    }

    canvas.addEventListener('click', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Vérifiez si le clic est à l'intérieur de la zone de l'image
        if (mouseX >= replay.position.x && mouseX <= replay.position.x + replayImage.width &&
            mouseY >= replay.position.y && mouseY <= replay.position.y + replayImage.height && scrollOffset > 30000) {
            // Appeler la fonction init() lorsque l'image est cliquée
            init();
        }
    });

}

//on démarre le jeu en cliquant sur le bouton play
arrivalImage.addEventListener("click", play);

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
    if (scrollOffset <= 30000) {
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
    }
    else { realplayer.velocity.x = 0; realplayer.velocity.y = 0 }
})
