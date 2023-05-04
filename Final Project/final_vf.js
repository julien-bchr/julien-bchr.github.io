// Import every elements for the home page 
const player = document.getElementById('player');
const colorbutton = document.getElementById('colorbutton');
const shapebutton = document.getElementById('shapebutton');
const playbutton = document.getElementById('playbutton');

// Import every constant needed
const gravity = 0.5
let table_scores = [];
let startTime;
let elapsedtime = 0;
let finish_time = 0;
let scrollOffset = 0;
let player_speed = 2;
let hp = 100;
var c;
var canvas;
const compteur = 0;
let isColliding = false;
let color_detection = 'red'

let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}


// Import every image needed in our game (platform, hills, sky, flag, win_display, replay_button, obstacle)
// And I precise their size when needed 
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

const obstacleImage = new Image();
obstacleImage.src = 'obstacle.png'
obstacleImage.width = obstacleImage.width * 0.1
obstacleImage.height = obstacleImage.height * 0.1
console.log(obstacleImage.height)

// Table for different shapes of our player 
const shapes = ['square', 'circle', 'triangle', 'diamond', 'star'];

// Variables to stock the color and shape of our player 
let currentShapeIndex = 0;
let currentColor = 'rgb(0, 0, 0)'
let currentShape = shapes[currentShapeIndex];

// Function to give a random number between min and max
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to change the color of our player 
function changeColor() {
    // Generate a random color
    currentColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    // Apply it to our player
    player.style.backgroundColor = currentColor;

}

// Function to change the shape of our player 
function changeShape() {
    // Récupérer la prochaine forme dans le tableau des formes
    currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
    currentShape = shapes[currentShapeIndex];
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
}

//function to start the game, it opens a new canvas
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

    // Remove the event listener from the play button
    playbutton.removeEventListener("click", play);
}

// Add events whenever we click on changeColor_button, changeShape_button, or play_button
colorbutton.addEventListener('click', changeColor);
shapebutton.addEventListener('click', changeShape);
playbutton.addEventListener("click", play);


const sol_y = screen.height - 2 * platformImage.height;
//We create a class with different shapes (square, circle, triangle, diamond, star)
class Shape {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.angle = 0;
        this.width = 30;
        this.height = 30;
        this.velocity = { x: 0, y: 10 };
    }

    //We draw our object called this
    draw() {
        switch (currentShape) {
            case 'circle':
                if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
                c.beginPath();
                c.arc(this.position.x + 15, this.position.y + 15, 15, 0, Math.PI * 2);
                c.closePath();
                c.fill();
                break;
            case 'triangle':
                if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
                c.beginPath();
                c.moveTo(this.position.x, this.position.y + 30);
                c.lineTo(this.position.x + 30, this.position.y + 30);
                c.lineTo(this.position.x + 15, this.position.y);
                c.closePath();
                c.fill();
                break;
            case 'diamond':
                if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
                c.beginPath();
                c.moveTo(this.position.x + 15, this.position.y - 10);
                c.lineTo(this.position.x + 30, this.position.y + 10);
                c.lineTo(this.position.x + 15, this.position.y + 30);
                c.lineTo(this.position.x, this.position.y + 10)
                c.closePath();
                c.fill();
                break;
            case 'star':
                if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
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
                if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
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
}

//Our player will be someone from our class Shape 
let realplayer = new Shape()

//We create a class for our plateforms
class Platform {
    constructor({ x, y }, isFixed = false) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = platformImage.width;
        this.height = platformImage.height;
        this.isFixed = isFixed;
    }

    draw() {
        c.drawImage(platformImage, this.position.x, this.position.y)
    }
}

//We create a list of every platform we need 
let platforms = [
    new Platform({ x: 0, y: sol_y }, true),
    new Platform({ x: platformImage.width - 3, y: sol_y }, true),
    new Platform({ x: 0.5 * platformImage.width, y: sol_y - 150 }, false),
    new Platform({ x: 0.8 * platformImage.width, y: sol_y - 300 }, false),
    new Platform({ x: 1.8 * platformImage.width, y: sol_y - 250 }, false),
    new Platform({ x: 2.8 * platformImage.width, y: sol_y - 200 }, false),
    new Platform({ x: 3.8 * platformImage.width, y: sol_y - 150 }, false),
    new Platform({ x: 4.8 * platformImage.width, y: sol_y - 100 }, false)
]
let end_position = platforms[platforms.length - 1].position.x + 800

//We create a class for hills 
class GenericObjects {
    constructor({ x, y }) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = hillsImage.width;
        this.height = hillsImage.height;
    }

    draw() {
        c.drawImage(hillsImage, this.position.x, this.position.y)
    }
}

//We create a list of every hill we need 
let hills = [
    new GenericObjects({ x: 0, y: sol_y }),
    new GenericObjects({ x: 100, y: sol_y - 300 })
]

//We create a class for the sky 
class sky {
    constructor({ x, y }) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = skyImage.width;
        this.height = skyImage.height;
    }

    draw() {
        c.drawImage(skyImage, this.position.x, this.position.y)
    }
}

let skys = [
    new sky({ x: 0, y: 0 }),
    new sky({ x: skyImage.width + 200, y: 0 }),
    new sky({ x: 2 * skyImage.width, y: 0 })
]

//We create a class for the flag 
class Arrival {
    constructor() {
        this.position = { x: end_position, y: sol_y - 250 };
        this.velocity = { x: 0, y: 0 };
        this.width = arrivalImage.width;
        this.height = arrivalImage.height;
    }

    draw() {
        c.drawImage(arrivalImage, this.position.x, this.position.y)
    }
}

let arrival = new Arrival()

//We create a class for the win_display
class Winning {
    constructor() {
        this.position = { x: 600, y: sol_y - 350 }
    }
    draw() {
        c.drawImage(winImage, this.position.x, this.position.y)
    }
}

let winning = new Winning()

//We create a class for the Replay button
class Replay {
    constructor() {
        this.position = { x: 900, y: sol_y - 450 }
    }
    draw() {
        c.drawImage(replayImage, this.position.x, this.position.y)
    }
}


let replay = new Replay()

//We create a class for our obstacles
class Obstacle {
    constructor({ x, y }, w, h, grow) {
        this.position = { x, y: y - (h - 10) * grow };
        this.velocity = { x: 0, y: 0 };
        this.width = w * grow;
        this.height = h * grow;
    }

    draw() {
        c.drawImage(obstacleImage, this.position.x, this.position.y, this.width, this.height)
    }
}

//We create a list with every obstacle we need 
let obstacles = [
    new Obstacle({ x: 0.5 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 150 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 0.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 300 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 1.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 250 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 2.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 200 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 3.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 150 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 4.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 100 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 0.5 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 0.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 1.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 2.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 3.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    new Obstacle({ x: 4.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
]


//This function allow us to start the game over
function init() {

    scrollOffset = 0;
    hp = 100;

    //je réinitialise l'état des touches
    keys.left.pressed = false;
    keys.right.pressed = false;

    //We create a class with different shapes (square, circle, triangle, diamond, star)
    class Shape {
        constructor() {
            this.position = { x: 100, y: 100 };
            this.angle = 0;
            this.width = 30;
            this.height = 30;
            this.velocity = { x: 0, y: 10 };
        }

        //We draw our object called this
        draw() {
            switch (currentShape) {
                case 'circle':
                    if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
                    c.beginPath();
                    c.arc(this.position.x + 15, this.position.y + 15, 15, 0, Math.PI * 2);
                    c.closePath();
                    c.fill();
                    break;
                case 'triangle':
                    if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
                    c.beginPath();
                    c.moveTo(this.position.x, this.position.y + 30);
                    c.lineTo(this.position.x + 30, this.position.y + 30);
                    c.lineTo(this.position.x + 15, this.position.y);
                    c.closePath();
                    c.fill();
                    break;
                case 'diamond':
                    if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
                    c.beginPath();
                    c.moveTo(this.position.x + 15, this.position.y - 10);
                    c.lineTo(this.position.x + 30, this.position.y + 10);
                    c.lineTo(this.position.x + 15, this.position.y + 30);
                    c.lineTo(this.position.x, this.position.y + 10)
                    c.closePath();
                    c.fill();
                    break;
                case 'star':
                    if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
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
                    if (isColliding) { c.fillStyle = color_detection } else { c.fillStyle = currentColor }
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
    }

    //Our player will be someone from our class Shape 
    realplayer = new Shape()

    //We create a class for our plateforms
    class Platform {
        constructor({ x, y }, isFixed = false) {
            this.position = { x, y };
            this.velocity = { x: 0, y: 0 };
            this.width = platformImage.width;
            this.height = platformImage.height;
            this.isFixed = isFixed;
        }

        draw() {
            c.drawImage(platformImage, this.position.x, this.position.y)
        }
    }

    //We create a list of every platform we need 
    platforms = [
        new Platform({ x: 0, y: sol_y }, true),
        new Platform({ x: platformImage.width - 3, y: sol_y }, true),
        new Platform({ x: 0.5 * platformImage.width, y: sol_y - 150 }, false),
        new Platform({ x: 0.8 * platformImage.width, y: sol_y - 300 }, false),
        new Platform({ x: 1.8 * platformImage.width, y: sol_y - 250 }, false),
        new Platform({ x: 2.8 * platformImage.width, y: sol_y - 200 }, false),
        new Platform({ x: 3.8 * platformImage.width, y: sol_y - 150 }, false),
        new Platform({ x: 4.8 * platformImage.width, y: sol_y - 100 }, false)
    ]

    //We create a class for hills 
    class GenericObjects {
        constructor({ x, y }) {
            this.position = { x, y };
            this.velocity = { x: 0, y: 0 };
            this.width = hillsImage.width;
            this.height = hillsImage.height;
        }

        draw() {
            c.drawImage(hillsImage, this.position.x, this.position.y)
        }
    }

    //We create a list of every hill we need 
    hills = [
        new GenericObjects({ x: 0, y: sol_y }),
        new GenericObjects({ x: 100, y: sol_y - 300 })
    ]

    //We create a class for the sky 
    class sky {
        constructor({ x, y }) {
            this.position = { x, y };
            this.velocity = { x: 0, y: 0 };
            this.width = skyImage.width;
            this.height = skyImage.height;
        }

        draw() {
            c.drawImage(skyImage, this.position.x, this.position.y)
        }
    }

    skys = [
        new sky({ x: 0, y: 0 }),
        new sky({ x: skyImage.width + 200, y: 0 }),
        new sky({ x: 2 * skyImage.width, y: 0 })
    ]

    //We create a class for the flag 
    class Arrival {
        constructor() {
            this.position = { x: end_position, y: sol_y - 250 };
            this.velocity = { x: 0, y: 0 };
            this.width = arrivalImage.width;
            this.height = arrivalImage.height;
        }

        draw() {
            c.drawImage(arrivalImage, this.position.x, this.position.y)
        }
    }

    arrival = new Arrival()

    //We create a class for the win_display
    class Winning {
        constructor() {
            this.position = { x: 600, y: sol_y - 350 }
        }
        draw() {
            c.drawImage(winImage, this.position.x, this.position.y)
        }
    }

    winning = new Winning()

    //We create a class for the Replay button
    class Replay {
        constructor() {
            this.position = { x: 900, y: sol_y - 450 }
        }
        draw() {
            c.drawImage(replayImage, this.position.x, this.position.y)
        }
    }


    replay = new Replay()

    //We create a class for our obstacles
    //We create a class for our obstacles
    class Obstacle {
        constructor({ x, y }, w, h, grow) {
            this.position = { x, y: y - (h - 10) * grow };
            this.velocity = { x: 0, y: 0 };
            this.width = w * grow;
            this.height = h * grow;
        }

        draw() {
            c.drawImage(obstacleImage, this.position.x, this.position.y, this.width, this.height)
        }
    }

    //We create a list with every obstacle we need 
    obstacles = [
        new Obstacle({ x: 0.5 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 150 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 0.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 300 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 1.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 250 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 2.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 200 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 3.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 150 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 4.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y - 100 }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 0.5 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 0.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 1.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 2.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 3.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
        new Obstacle({ x: 4.8 * platformImage.width + randomIntFromInterval(0, platformImage.width - obstacleImage.width), y: sol_y }, obstacleImage.width, obstacleImage.height, Math.random() * 2 + 1),
    ]
}

// This function is the main one, it does animate our canvas
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
    skys.forEach((sky) => { sky.draw() })
    hills.forEach((GenericObjects) => { GenericObjects.draw() })

    platforms.forEach((platform) => {
        if (keys.right.pressed && realplayer.position.x < 500 && scrollOffset < end_position) { realplayer.velocity.x = player_speed * (platforms.length - 2) }
        else if (keys.left.pressed && realplayer.position.x > 50 && scrollOffset < end_position) { realplayer.velocity.x = -player_speed * (platforms.length - 2) }
        else {
            realplayer.velocity.x = 0
            // le && permet de garder les plateformes avec la propriété fixe fixes
            if (keys.right.pressed && platform.isFixed == false && scrollOffset < end_position) {
                platform.position.x -= player_speed * (platforms.length - 2)
                hills.forEach((GenericObjects) => { GenericObjects.position.x -= player_speed * 0.6 })
                skys.forEach((sky) => { sky.position.x -= player_speed * 0.2 })
                obstacles.forEach((Obstacle) => { Obstacle.position.x -= player_speed })
                arrival.position.x -= player_speed
                scrollOffset += player_speed
            }
            console.log(scrollOffset)
            console.log(end_position)

            if (keys.left.pressed && platform.isFixed == false && scrollOffset < end_position) {
                platform.position.x += player_speed * (platforms.length - 2)
                hills.forEach((GenericObjects) => { GenericObjects.position.x += player_speed * 0.6 })
                skys.forEach((sky) => { sky.position.x += player_speed * 0.2 })
                obstacles.forEach((Obstacle) => { Obstacle.position.x += player_speed })
                arrival.position.x += player_speed
                scrollOffset -= player_speed
            }
        }
        if (realplayer.position.y + realplayer.height <= platform.position.y && realplayer.position.y + realplayer.height + realplayer.velocity.y >= platform.position.y && platform.position.x <= realplayer.position.x + realplayer.width && realplayer.position.x <= platform.position.x + platform.width) { realplayer.velocity.y = 0 } //platform collision detection
        if (end_position <= scrollOffset && scrollOffset < end_position + player_speed) {
            console.log('you win in:' + elapsedtime_string + 's'); realplayer.velocity.x = 0; realplayer.position.x = arrivalImage.width / 2; arrival.position.x = 0; winning.draw(); finish_time = elapsedtime_string; scrollOffset += 150
        }
        else if (scrollOffset > end_position + player_speed) { realplayer.velocity.x = 0; realplayer.position.x = arrivalImage.width / 2; arrival.position.x = 0; winning.draw(); replay.draw(); console.log('ça marche') }
    })

    // obstacle collision detection 
    obstacles.forEach((Obstacle) => {
        if (realplayer.position.y <= Obstacle.position.y + Obstacle.height &&
            realplayer.position.y + realplayer.height + realplayer.velocity.y >= Obstacle.position.y &&
            Obstacle.position.x <= realplayer.position.x + realplayer.width - 15 &&
            realplayer.position.x <= Obstacle.position.x + Obstacle.width - 10) { isColliding = true, hp -= 3 } //obstacle collision detection 
    })

    // player become black whenever it hits an obstacle
    if (isColliding) {
        setTimeout(() => {
            isColliding = false;
        }, 100); // 1000 ms = 1 seconde
    }


    platforms.forEach((platform) => { platform.draw('red') })
    obstacles.forEach((obstacle) => { obstacle.draw() })
    arrival.draw()
    realplayer.update()

    // Afficher le temps écoulé sur le canvas
    if (scrollOffset < end_position) {
        c.fillStyle = 'black';
        c.font = '24px TimesNewRoman';
        c.fillText(`Time: ${elapsedtime_string} s`, 1000, 130);
        c.fillText(`HP: ${hp} <3`, 1000, 160);// Afficher le temps en secondes
    }
    else {
        c.fillStyle = 'black';
        c.font = '24px TimesNewRoman';
        c.fillText(`Final time: ${finish_time} s`, 1000, 130);
        c.fillText(`Your Score:`, 100, 100);
        c.fillText(`Time Score: 716 / ${finish_time} * 0.5 = ${(716 / finish_time).toFixed(0) * 0.5} pts`, 120, 130);
        c.fillText(`HP Score: ${hp} / 2 = ${hp / 2} pts`, 120, 160);
        c.fillText(`Final Score: ${(716 / finish_time).toFixed(0) * 0.5 + hp / 2} %`, 120, 190);
    }

    // if score is zero, the game starts again
    if (hp <= 0) { init() }

    canvas.addEventListener('click', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Vérifiez si le clic est à l'intérieur de la zone de l'image
        if (mouseX >= replay.position.x && mouseX <= replay.position.x + replayImage.width &&
            mouseY >= replay.position.y && mouseY <= replay.position.y + replayImage.height && scrollOffset > end_position) {
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
            if (realplayer.velocity.y === 1) { realplayer.velocity.y -= 20 }
            console.log(realplayer.velocity.y)
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
    if (scrollOffset <= end_position) {
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
