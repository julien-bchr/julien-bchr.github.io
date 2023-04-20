// Exemple de code JavaScript
const mario = document.getElementById('mario');
let marioX = 0;
let marioY = 0;

// Fonction pour mettre à jour la position de Mario
function updateMarioPosition() {
    mario.style.transform = `translate(${marioX}px, ${marioY}px)`;
}

// Écouter les événements de pression de touches
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            marioY -= 10;
            break;
        case 'ArrowDown':
            marioY += 10;
            break;
        case 'ArrowLeft':
            marioX -= 10;
            break;
        case 'ArrowRight':
            marioX += 10;
            break;
    }
    updateMarioPosition();
});