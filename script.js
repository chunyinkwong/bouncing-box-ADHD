// script.js
const dvdLogo = document.getElementById('dvd-logo');
const container = document.getElementById('container');
const bounceSound = document.getElementById('bounce-sound');

let x = Math.random() * (container.clientWidth - dvdLogo.clientWidth);
let y = Math.random() * (container.clientHeight - dvdLogo.clientHeight);
let dx = 2;
let dy = 2;

function moveLogo() {
    x += dx;
    y += dy;

    if (x + dvdLogo.clientWidth >= container.clientWidth || x <= 0) {
        dx *= -1;
        changeColor();
        playSound();
    }

    if (y + dvdLogo.clientHeight >= container.clientHeight || y <= 0) {
        dy *= -1;
        changeColor();
        playSound();
    }

    dvdLogo.style.left = x + 'px';
    dvdLogo.style.top = y + 'px';

    requestAnimationFrame(moveLogo);
}

function changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    dvdLogo.style.filter = `invert(1) sepia(1) saturate(5) hue-rotate(${Math.random() * 360}deg)`;
}

function playSound() {
    bounceSound.currentTime = 0;
    bounceSound.play();
}

moveLogo();