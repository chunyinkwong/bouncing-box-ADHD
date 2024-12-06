const container = document.getElementById('container');
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const bounceSound = document.getElementById('bounce-sound');
const patternButton = document.getElementById('patternButton');
const spawnBallButton = document.getElementById('spawnBallButton');
const muteButton = document.getElementById('muteButton');

let balls = [];
let trailAmount = 0.15
let isMuted = true;
bounceSound.muted = true;

function createBall() {
    let ball = {
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20),
        dx: 2,
        dy: 2,
        ballColor: "red",
        ballSpeed: 5,
        ballRadius: 15
    };
    balls.push(ball);
}

const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', (event) => {
    balls.forEach(ball => ball.ballSpeed = event.target.value);
});

const radiusSlider = document.getElementById('radiusSlider');
radiusSlider.addEventListener('input', (event) => {
    balls.forEach(ball => ball.ballRadius = event.target.value);
});

const trailSlider = document.getElementById('trailSlider');
trailSlider.addEventListener('input', (event) => {
    trailAmount = event.target.value;
});

function getBackgroundFill() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
        return `rgba(32, 32, 32, ${trailAmount})`;
    } else {
        return `rgba(255, 255, 255, ${trailAmount})`;
    }
}

function moveBalls() {
    ctx.fillStyle = getBackgroundFill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.x += ball.dx * ball.ballSpeed;
        ball.y += ball.dy * ball.ballSpeed;

        if (ball.x + ball.ballRadius >= canvas.width || ball.x - ball.ballRadius <= 0) {
            ball.dx *= -1;
            changeColor(ball);
            playSound();
        }

        if (ball.y + ball.ballRadius >= canvas.height || ball.y - ball.ballRadius <= 0) {
            ball.dy *= -1;
            changeColor(ball);
            playSound();
        }

        drawBall(ball);
    });

    requestAnimationFrame(moveBalls);
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.ballColor;
    ctx.fill();
    ctx.closePath();
}

function changeColor(ball) {
    const h = Math.floor(Math.random() * 360); // Hue: 0-360
    const s = 100; // Saturation: 100%
    const l = 50; // Lightness: 50%
    ball.ballColor = `hsl(${h}, ${s}%, ${l}%)`;
}

function playSound() {
    bounceSound.currentTime = 0;
    bounceSound.play();
}

function changePattern() {
    balls.forEach(ball => {
        const angle = Math.random() * 2 * Math.PI;
        ball.dx = Math.cos(angle);
        ball.dy = Math.sin(angle);
        changeColor(ball);
    });
}

patternButton.addEventListener('click', changePattern);
spawnBallButton.addEventListener('click', createBall);
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    bounceSound.muted = isMuted;
});

createBall(); // Create the initial ball
moveBalls();