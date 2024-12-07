document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    const bounceSound = document.getElementById('bounce-sound');
    const patternButton = document.getElementById('patternButton');
    const spawnBallButton = document.getElementById('increaseBallButton');
    const muteButton = document.getElementById('muteButton');
    const togglePatternButton = document.getElementById('togglePatternButton');
    const subtractBallButton = document.getElementById('decreaseBallButton');
    const ballCounter = document.getElementById('ballCounter');

    let balls = [];
    let trailAmount = 0.15;
    let isMuted = true;
    let patternMode = 'normal';
    let timer = 0;
    bounceSound.muted = true;

    function updateBallCounter() {
        ballCounter.value = balls.length;
    }

    function createBall() {
        if (balls.length >= 99) return;
        
        const speed = Number(speedSlider.value);
        const radius = Number(radiusSlider.value);
        
        let ball = {
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            dx: 1,
            dy: 1,
            ballColor: "red",
            ballSpeed: speed,
            ballRadius: radius
        };
        balls.push(ball);
        updateBallCounter();
    }

    function subtractBall() {
        if (balls.length > 0) {
            balls.pop();
            updateBallCounter();
        }
    }

    ballCounter.addEventListener('input', (event) => {
        let newCount = Number(event.target.value);
        const maxCount = 99;
        if (newCount > maxCount) {
            ballCounter.value = maxCount;
            newCount = maxCount
        } else if (newCount < 0) {
            ballCounter.value = 0;
            newCount = maxCount
        } 
        if (newCount > balls.length) {
            while (balls.length < newCount) {
                createBall();
            }
        } else {
            while (balls.length > newCount) {
                subtractBall();
            }
        }
    });

    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', (event) => {
        balls.forEach(ball => ball.ballSpeed = Number(event.target.value)); // Convert to number
    });

    const radiusSlider = document.getElementById('radiusSlider');
    radiusSlider.addEventListener('input', (event) => {
        balls.forEach(ball => ball.ballRadius = Number(event.target.value));
    });

    const trailSlider = document.getElementById('trailSlider');
    trailSlider.addEventListener('input', (event) => {
        trailAmount = event.target.value;
    });

    patternButton.addEventListener('click', changePattern);
    spawnBallButton.addEventListener('click', createBall);
    subtractBallButton.addEventListener('click', subtractBall); // Add event listener
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        bounceSound.muted = isMuted;
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

            // Ensure the ball's position is within the canvas boundaries
            ball.x = Math.max(ball.ballRadius, Math.min(ball.x, canvas.width - ball.ballRadius));
            ball.y = Math.max(ball.ballRadius, Math.min(ball.y, canvas.height - ball.ballRadius));

            drawBall(ball);
        });

        timer += 1; // Increment the timer
        requestAnimationFrame(moveBalls);
    }

    function drawBall(ball) {
        if (patternMode === '3d') {
            const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.ballRadius * 2);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, ball.ballColor);
            ctx.fillStyle = gradient;
        } else if (patternMode === 'rainbow') {
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
            const segmentAngle = (2 * Math.PI) / colors.length;
            const rotation = 0.1 * timer; // Calculate rotation based on timer

            for (let i = 0; i < colors.length; i++) {
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.ballRadius, i * segmentAngle + rotation, (i + 1) * segmentAngle + rotation);
                ctx.lineTo(ball.x, ball.y);
                ctx.closePath();
                ctx.fillStyle = colors[i];
                ctx.fill();
            }
            return;
        } else if (patternMode === 'christmas') {
            const colors = ['red', 'white', 'green', 'red', 'white', 'green'];
            const segmentAngle = (2 * Math.PI) / colors.length;
            const rotation = 0.25 * timer; // Calculate rotation based on timer

            for (let i = 0; i < colors.length; i++) {
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.ballRadius, i * segmentAngle + rotation, (i + 1) * segmentAngle + rotation);
                ctx.lineTo(ball.x, ball.y);
                ctx.closePath();
                ctx.fillStyle = colors[i];
                ctx.fill();
            }
            return;
        } else {
            ctx.fillStyle = ball.ballColor;
        }
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    function changeColor(ball) {
        const h = Math.floor(Math.random() * 360); // Hue: 0-360
        const s = 100; // Saturation: 100%
        const l = 50; // Lightness: 50%
        ball.ballColor = `hsl(${h}, ${s}%, ${l}%)`;
    }

    function playSound() {
        if (isMuted) return;
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

    togglePatternButton.addEventListener('click', () => {
        if (patternMode === 'normal') {
            patternMode = '3d';
        } else if (patternMode === '3d') {
            patternMode = 'rainbow';
        } else if (patternMode === 'rainbow') {
            patternMode = 'christmas';
        } else {
            patternMode = 'normal';
        }
    });

    createBall(); // Create the initial ball
    moveBalls();
});