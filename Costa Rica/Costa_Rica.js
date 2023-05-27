var i = -1;
var j = 0;
const Bouton_gauche = ["Le fait pas", "Pas besoin", "Au sommet !", "Motivation !", "Le diapo !"]
const Bouton_droit = ["fais le singe", "oui Jamy", "Repose-toi", "Pas besoin", "Le diapo !"]

window.onload = function () {
    //j'upload toutes mes vidéos 

    const video1 = document.getElementById('video1');
    const video1_container = document.getElementsByClassName('video1_container')[0]
    const diapo = document.getElementById('diapo');
    const diapo_container = document.getElementsByClassName('diapo_container')[0]

    const videos = [
        [document.getElementById('video2_1'), document.getElementById('video2_2')],
        [document.getElementById('video3_1'), document.getElementById('video3_2')],
        [document.getElementById('video4_1'), document.getElementById('video4_2')],
        [document.getElementById('video5_1'), document.getElementById('video5_2')],
        [document.getElementById('video6_1'), document.getElementById('video6_2')]
    ]

    const videos_container = [
        [document.getElementsByClassName('video2_1_container')[0], document.getElementsByClassName('video2_2_container')[0]],
        [document.getElementsByClassName('video3_1_container')[0], document.getElementsByClassName('video3_2_container')[0]],
        [document.getElementsByClassName('video4_1_container')[0], document.getElementsByClassName('video4_2_container')[0]],
        [document.getElementsByClassName('video5_1_container')[0], document.getElementsByClassName('video5_2_container')[0]],
        [document.getElementsByClassName('video6_1_container')[0], document.getElementsByClassName('video6_2_container')[0]]
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
        video1_container.style.display = 'block';
        video1.requestFullscreen()
        option1.style.display = 'block';
        option2.style.display = 'block';
    })

    //je clique sur l'option1
    option1.addEventListener('click', function () {
        if (i == -1) {
            video1_container.style.display = 'none';
            videos_container[0][0].style.display = 'block';
            videos[0][0].requestFullscreen();
            i = 0;
            j = 0;
            option1Text.innerHTML = Bouton_gauche[i];
            option2Text.innerHTML = Bouton_droit[i];
        }
        else if (i >= 0 && i <= 3) {
            videos_container[i][j].style.display = 'none';;
            videos_container[i + 1][0].style.display = 'block';
            videos[i + 1][0].requestFullscreen();
            i++;
            j = 0;
            option1Text.innerHTML = Bouton_gauche[i];
            option2Text.innerHTML = Bouton_droit[i];
        }
        else if (i == 4) {
            videos_container[4][j].style.display = 'none';
            diapo_container.style.display = 'block';
            diapo.requestFullscreen();
        }

    })

    //je clique sur l'option2
    option2.addEventListener('click', function () {
        if (i == -1) {
            video1_container.style.display = 'none';
            videos_container[0][1].style.display = 'block';
            videos[0][1].requestFullscreen();
            i = 0;
            j = 1;
            option1Text.innerHTML = Bouton_gauche[i]
            option2Text.innerHTML = Bouton_droit[i]
        }
        else if (i >= 0 && i <= 3) {
            videos_container[i][j].style.display = 'none';
            videos_container[i + 1][1].style.display = 'block';
            videos[i + 1][1].requestFullscreen();
            i++;
            j = 1;
            option1Text.innerHTML = Bouton_gauche[i];
            option2Text.innerHTML = Bouton_droit[i];
        }
        else if (i == 4) {
            videos_container[4][j].style.display = 'none';
            diapo_container.style.display = 'block';
            diapo.requestFullscreen();
        }
    })

};
