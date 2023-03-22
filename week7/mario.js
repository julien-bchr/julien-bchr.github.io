const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.5 //pour plus de réalisme, on rajoute une accélération 

class Player {
    // on pose les bases: un carré de telle taille, telle position, telle vitesse
    constructor() {
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 10 };
        this.width = 30;
        this.height = 30;
    }

    // on dessine notre objet qu'on appelle this
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
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

class Platform {
    constructor({ x, y }) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = 100;
        this.height = 15;
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
// const platform = new Platform()
const platforms = [new Platform({ x: 200, y: 100 }), new Platform({ x: 500, y: 200 })]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

// we want to loop our animation
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height) //on souhaite supprimer les images précédentes au cours du temps
    platforms.forEach((platform) => {
        if (keys.right.pressed && player.position.x < 500) { player.velocity.x = 5 }
        else if (keys.left.pressed && player.position.x > 50) { player.velocity.x = -5 }
        else {
            player.velocity.x = 0
            if (keys.right.pressed) {
                platform.position.x -= 5
            }
            if (keys.left.pressed) {
                platform.position.x += 5
            }
        }
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && platform.position.x <= player.position.x + player.width && player.position.x <= platform.position.x + platform.width) { player.velocity.y = 0 } //platform collision detection
    })

    player.update()
    platforms.forEach((platform) => { platform.draw() })

}

animate() //ne pas oublier d'appeler la fonction sinon rien ne se passera (c'est comme print en python)

window.addEventListener('keydown', ({ keyCode }) => { //keydown signifie lorsque l'on presse une touche 
    // console.log(keyCode) //ça m"écrit le keyCode dans la console
    switch (keyCode) {
        case 38:
            console.log('up')
            player.velocity.y -= 20
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


addEventListener('keyup', ({ keyCode }) => { //keyup signifie lorsque l'on ne presse pas une touche 
    switch (keyCode) {
        case 38:
            console.log('up')
            player.velocity.y -= 0
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