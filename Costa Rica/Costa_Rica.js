var i = -1;
var j = 0;
const Bouton_gauche = ["Le fait pas", "Pas besoin", "Au sommet !", "Motivation !", "Le diapo !"]
const Bouton_droit = ["fais le singe", "oui Jamy", "Repose-toi", "Pas besoin", "Le diapo !"]

window.onload = function () {
    //j'upload toutes mes vidéos 

    const video1 = document.getElementById('video1');
    const diapo = document.getElementById('diapo');

    const videos = [
        [document.getElementById('video2_1'), document.getElementById('video2_2')],
        [document.getElementById('video3_1'), document.getElementById('video3_2')],
        [document.getElementById('video4_1'), document.getElementById('video4_2')],
        [document.getElementById('video5_1'), document.getElementById('video5_2')],
        [document.getElementById('video6_1'), document.getElementById('video6_2')]
    ]

    //j'upload bouton start, option1, et option2
    const startButton = document.getElementById('start');
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    const option1Text = document.querySelector('#option1 .bouton_gauche');
    const option2Text = document.querySelector('#option2 .bouton_droit');

    //lorsque j'appuie sur le bouton start pour commencer
    startButton.addEventListener('click', function () {
        startButton.remove()
        video1.style.display = 'inline-grid';
        video1.requestFullscreen();
        video1.play()
    })

    //la video1 se termine
    attachEndedEvent(video1)

    //fonction qui permet de sortir du plein écran quand une vidéo est terminée
    function attachEndedEvent(videoElement) {
        videoElement.addEventListener('ended', function () {
            document.exitFullscreen();
            option1.style.display = 'block';
            option2.style.display = 'block';
        });
    }

    //je clique sur l'option1
    option1.addEventListener('click', function () {
        if (i == -1) {
            video1.remove();
            videos[0][0].style.display = 'inline-grid';
            videos[0][0].requestFullscreen();
            videos[0][0].play();
            i = 0;
            j = 0;
            option1Text.innerHTML = Bouton_gauche[i];
            option2Text.innerHTML = Bouton_droit[i];
            option1.style.display = 'none';
            option2.style.display = 'none';
            attachEndedEvent(videos[0][0])
        }
        else if (i >= 0 && i <= 3) {
            videos[i][j].remove();
            videos[i + 1][0].style.display = 'inline-grid';
            videos[i + 1][0].requestFullscreen();
            videos[i + 1][0].play();
            i++;
            j = 0;
            option1Text.innerHTML = Bouton_gauche[i];
            option2Text.innerHTML = Bouton_droit[i];
            option1.style.display = 'none';
            option2.style.display = 'none';
            attachEndedEvent(videos[i][0])
        }
        else if (i == 4) {
            videos[4][j].remove()
            diapo.style.display = 'inline-grid';
            diapo.requestFullscreen();
            diapo.play()
            option1.style.display = 'none'
            option2.style.display = 'none'
        }

    })

    //je clique sur l'option2
    option2.addEventListener('click', function () {
        if (i == -1) {
            video1.remove();
            videos[0][1].style.display = 'inline-grid';
            videos[0][1].requestFullscreen();
            videos[0][1].play();
            i = 0;
            j = 1;
            option1Text.innerHTML = Bouton_gauche[i]
            option2Text.innerHTML = Bouton_droit[i]
            option1.style.display = 'none'
            option2.style.display = 'none'
            attachEndedEvent(videos[0][1]);
        }
        else if (i >= 0 && i <= 3) {
            videos[i][j].remove();
            videos[i + 1][1].style.display = 'inline-grid';
            videos[i + 1][1].requestFullscreen();
            videos[i + 1][1].play();
            i++;
            j = 1;
            option1Text.innerHTML = Bouton_gauche[i];
            option2Text.innerHTML = Bouton_droit[i];
            option1.style.display = 'none'
            option2.style.display = 'none'
            attachEndedEvent(videos[i][1])
        }
        else if (i == 4) {
            videos[4][j].remove()
            diapo.style.display = 'inline-grid';
            diapo.requestFullscreen();
            diapo.play()
            option1.style.display = 'none'
            option2.style.display = 'none'
        }
    })

};