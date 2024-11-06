const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton');

// Canvas set
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const birdImage = new Image();
birdImage.src = 'images/bird.png'; 


let birdY;
let birdVelocity;
let birdAcceleration = 0.25;
const birdSize = 40; 
const jumpStrength = -4; 

let pillars;
const pillarWidth = 60;
const gapHeight = 220;
let frameCount;
let score;
let gameRunning;


function initGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pillars = [];
    frameCount = 0;
    score = 0;
    gameRunning = true;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'none';
}

// Bird controls
document.addEventListener('click', () => {
    if (gameRunning) birdVelocity = jumpStrength;
});
document.addEventListener('touchstart', () => {
    if (gameRunning) birdVelocity = jumpStrength;
});

// Restart game
restartButton.addEventListener('click', () => {
    initGame();
    gameLoop();
});

// Game loop
function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

       
        birdVelocity += birdAcceleration;
        birdY += birdVelocity;
        ctx.drawImage(birdImage, 50, birdY, birdSize, birdSize);

        // Generate pillars
        frameCount++;
        if (frameCount % 100 === 0) {
            const pillarTopHeight = Math.random() * (canvas.height - gapHeight - 50) + 20;
            pillars.push({
                x: canvas.width,
                topHeight: pillarTopHeight,
                bottomY: pillarTopHeight + gapHeight,
                passed: false
            });
        }

        // Move and draw pillars
        ctx.fillStyle = 'green';
        pillars.forEach((pillar, index) => {
            pillar.x -= 2.5;

            // Top pillar
            ctx.fillRect(pillar.x, 0, pillarWidth, pillar.topHeight);
            // Bottom pillar
            ctx.fillRect(pillar.x, pillar.bottomY, pillarWidth, canvas.height - pillar.bottomY);

            // Check 
            if (!pillar.passed && pillar.x + pillarWidth < 50) {
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                pillar.passed = true;
            }

            // Collision detection
            if (
                (50 < pillar.x + pillarWidth && 50 + birdSize > pillar.x) &&
                (birdY < pillar.topHeight || birdY + birdSize > pillar.bottomY)
            ) {
                endGame();
            }

            // Remove  pillars
            if (pillar.x + pillarWidth < 0) {
                pillars.splice(index, 1);
            }
        });

        // Check 2
        if (birdY + birdSize > canvas.height || birdY < 0) {
            endGame();
        }

        requestAnimationFrame(gameLoop);
    }
}

// End the game
function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'flex';
}

// Start the game 
initGame();
gameLoop();
