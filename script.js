const container = document.getElementById('container');
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const bounceSound = document.getElementById('bounce-sound');

let x = Math.random() * (canvas.width - 20);
let y = Math.random() * (canvas.height - 20);
let canvasBackgroundColor = 'rgba(255, 255, 255, 0.15)';

let dx = 2;
let dy = 2;
let ballColor = "red";

let ballSpeed = 5;
const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', (event) => {
    ballSpeed = event.target.value;
});

let ballRadius = 10;
const radiusSlider = document.getElementById('radiusSlider');
radiusSlider.addEventListener('input', (event) => {
    ballRadius = event.target.value;
});

let trailAmount = 0.15;
const trailSlider = document.getElementById('trailSlider');
trailSlider.addEventListener('input', (event) => {
    trailAmount = event.target.value;
    console.log(trailAmount)
});

function getBackgroundFill() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
        return `rgba(32, 32, 32, ${trailAmount})`;
    } else {
        return `rgba(255, 255, 255, ${trailAmount})`;
    }
}

function moveBall() {
    ctx.fillStyle = getBackgroundFill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x += dx * ballSpeed;
    y += dy * ballSpeed;

    if (x + ballRadius >= canvas.width || x - ballRadius <= 0) {
        dx *= -1;
        changeColor();
        playSound();
    }

    if (y + ballRadius >= canvas.height || y - ballRadius <= 0) {
        dy *= -1;
        changeColor();
        playSound();
    }

    drawBall();
    requestAnimationFrame(moveBall);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function changeColor() {
    // const r = Math.floor(Math.random() * 256);
    // const g = Math.floor(Math.random() * 256);
    // const b = Math.floor(Math.random() * 256);

    const h = Math.floor(Math.random() * 360); // Hue: 0-360
    const s = 100; // Saturation: 100%
    const l = 50; // Lightness: 50%
    ballColor = `hsl(${h}, ${s}%, ${l}%)`;
}

function playSound() {
    bounceSound.currentTime = 0;
    bounceSound.play();
}

moveBall();