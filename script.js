// Game variables
let canvas, ctx;
let gameStarted = false;
let gameOver = false;
let score = 0;
let lives = 3;
let animationFrameId;

// Sonic character
const sonic = {
    x: 100,
    y: 400,
    width: 48,
    height: 48,
    speed: 5,
    jumpForce: 15,
    velocityY: 0,
    gravity: 0.8,
    isJumping: false,
    direction: 'right',
    spriteSheet: new Image(),
    spriteX: 0,
    frameCount: 0,
    frameDelay: 5,
    currentFrame: 0,
    invulnerable: false,
    invulnerableTimer: 0
};

// Game elements
let platforms = [];
let rings = [];
let enemies = [];

// Controls
const keys = {
    right: false,
    left: false,
    up: false,
    space: false
};

// Images
const ringImg = new Image();
const enemyImg = new Image();
const backgroundImg = new Image();

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 760;
    canvas.height = 480;
    
    // Load images with fallback
    loadGameAssets();
    
    // Create initial platforms
    createPlatforms();
    
    // Add event listeners
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Draw initial screen
    drawStartScreen();
}

// Load game assets with fallback generation
function loadGameAssets() {
    // Set up error handlers to create fallback assets if loading fails
    sonic.spriteSheet.onerror = function() {
        console.log("Creating fallback Sonic sprite");
        createSonicSprite(sonic.spriteSheet);
    };
    
    ringImg.onerror = function() {
        console.log("Creating fallback ring");
        createRingSprite(ringImg);
    };
    
    enemyImg.onerror = function() {
        console.log("Creating fallback enemy");
        createEnemySprite(enemyImg);
    };
    
    backgroundImg.onerror = function() {
        console.log("Creating fallback background");
        createBackgroundImage(backgroundImg);
    };
    
    // Try to load the images from files first
    sonic.spriteSheet.src = 'assets/sonic-sprite.png';
    ringImg.src = 'assets/ring.png';
    enemyImg.src = 'assets/enemy.png';
    backgroundImg.src = 'assets/background.png';
}

// Create Sonic sprite sheet directly
function createSonicSprite(img) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 192;
    tempCanvas.height = 48;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Colors
    const blueColor = '#1a75ff';
    const skinColor = '#ffcc99';
    const shoeColor = '#ff3300';
    
    // Draw 4 frames of animation
    for (let frame = 0; frame < 4; frame++) {
        const x = frame * 48;
        
        // Body
        tempCtx.fillStyle = blueColor;
        tempCtx.beginPath();
        tempCtx.ellipse(x + 24, 24, 16, 20, 0, 0, Math.PI * 2);
        tempCtx.fill();
        
        // Face
        tempCtx.fillStyle = skinColor;
        tempCtx.beginPath();
        tempCtx.ellipse(x + 28, 20, 10, 12, 0, 0, Math.PI * 2);
        tempCtx.fill();
        
        // Eye
        tempCtx.fillStyle = 'white';
        tempCtx.beginPath();
        tempCtx.ellipse(x + 32, 18, 4, 5, 0, 0, Math.PI * 2);
        tempCtx.fill();
        
        tempCtx.fillStyle = 'black';
        tempCtx.beginPath();
        tempCtx.ellipse(x + 33, 18, 2, 3, 0, 0, Math.PI * 2);
        tempCtx.fill();
        
        // Shoes
        tempCtx.fillStyle = shoeColor;
        
        // Different leg positions for each frame
        if (frame === 0) {
            tempCtx.fillRect(x + 16, 38, 10, 6);
            tempCtx.fillRect(x + 28, 38, 10, 6);
        } else if (frame === 1) {
            tempCtx.fillRect(x + 14, 36, 10, 8);
            tempCtx.fillRect(x + 30, 38, 10, 6);
        } else if (frame === 2) {
            tempCtx.fillRect(x + 16, 38, 10, 6);
            tempCtx.fillRect(x + 28, 38, 10, 6);
        } else {
            tempCtx.fillRect(x + 16, 38, 10, 6);
            tempCtx.fillRect(x + 30, 36, 10, 8);
        }
        
        // Spikes
        tempCtx.fillStyle = blueColor;
        tempCtx.beginPath();
        tempCtx.moveTo(x + 12, 16);
        tempCtx.lineTo(x + 4, 24);
        tempCtx.lineTo(x + 12, 28);
        tempCtx.closePath();
        tempCtx.fill();
        
        tempCtx.beginPath();
        tempCtx.moveTo(x + 14, 12);
        tempCtx.lineTo(x + 8, 6);
        tempCtx.lineTo(x + 18, 10);
        tempCtx.closePath();
        tempCtx.fill();
        
        tempCtx.beginPath();
        tempCtx.moveTo(x + 20, 10);
        tempCtx.lineTo(x + 16, 2);
        tempCtx.lineTo(x + 24, 8);
        tempCtx.closePath();
        tempCtx.fill();
    }
    
    // Set the image source to the canvas data URL
    img.src = tempCanvas.toDataURL('image/png');
}

// Create ring sprite directly
function createRingSprite(img) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 24;
    tempCanvas.height = 24;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Outer ring
    tempCtx.fillStyle = '#ffcc00';
    tempCtx.beginPath();
    tempCtx.arc(12, 12, 10, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Inner hole
    tempCtx.fillStyle = '#fff';
    tempCtx.beginPath();
    tempCtx.arc(12, 12, 4, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Shine effect
    tempCtx.fillStyle = '#ffffcc';
    tempCtx.beginPath();
    tempCtx.arc(8, 8, 2, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Set the image source to the canvas data URL
    img.src = tempCanvas.toDataURL('image/png');
}

// Create enemy sprite directly
function createEnemySprite(img) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 40;
    tempCanvas.height = 30;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Body
    tempCtx.fillStyle = '#cc0000';
    tempCtx.beginPath();
    tempCtx.ellipse(20, 15, 16, 12, 0, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Eyes
    tempCtx.fillStyle = 'white';
    tempCtx.beginPath();
    tempCtx.arc(14, 12, 4, 0, Math.PI * 2);
    tempCtx.fill();
    
    tempCtx.beginPath();
    tempCtx.arc(26, 12, 4, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Pupils
    tempCtx.fillStyle = 'black';
    tempCtx.beginPath();
    tempCtx.arc(14, 12, 2, 0, Math.PI * 2);
    tempCtx.fill();
    
    tempCtx.beginPath();
    tempCtx.arc(26, 12, 2, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Spikes
    tempCtx.fillStyle = '#cc0000';
    for (let i = 0; i < 5; i++) {
        tempCtx.beginPath();
        tempCtx.moveTo(8 + i * 6, 22);
        tempCtx.lineTo(11 + i * 6, 28);
        tempCtx.lineTo(14 + i * 6, 22);
        tempCtx.closePath();
        tempCtx.fill();
    }
    
    // Set the image source to the canvas data URL
    img.src = tempCanvas.toDataURL('image/png');
}

// Create background image directly
function createBackgroundImage(img) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 760;
    tempCanvas.height = 480;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Sky gradient
    const skyGradient = tempCtx.createLinearGradient(0, 0, 0, 300);
    skyGradient.addColorStop(0, '#87ceeb');
    skyGradient.addColorStop(1, '#e0f7ff');
    tempCtx.fillStyle = skyGradient;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Sun
    tempCtx.fillStyle = '#ffff99';
    tempCtx.beginPath();
    tempCtx.arc(100, 80, 40, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Clouds
    tempCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Helper function to draw clouds
    function drawCloud(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.arc(15, -10, 15, 0, Math.PI * 2);
        ctx.arc(30, 0, 20, 0, Math.PI * 2);
        ctx.arc(15, 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Cloud 1
    drawCloud(tempCtx, 150, 100, 1);
    // Cloud 2
    drawCloud(tempCtx, 400, 70, 1.2);
    // Cloud 3
    drawCloud(tempCtx, 650, 120, 0.8);
    
    // Hills
    tempCtx.fillStyle = '#7cbb00';
    tempCtx.beginPath();
    tempCtx.moveTo(0, 350);
    tempCtx.bezierCurveTo(200, 280, 300, 300, 500, 320);
    tempCtx.bezierCurveTo(650, 330, 750, 350, 760, 350);
    tempCtx.lineTo(760, 480);
    tempCtx.lineTo(0, 480);
    tempCtx.closePath();
    tempCtx.fill();
    
    // Mountains in background
    tempCtx.fillStyle = '#6b8e23';
    tempCtx.beginPath();
    tempCtx.moveTo(0, 320);
    tempCtx.lineTo(150, 200);
    tempCtx.lineTo(250, 280);
    tempCtx.lineTo(350, 180);
    tempCtx.lineTo(500, 300);
    tempCtx.lineTo(600, 220);
    tempCtx.lineTo(760, 300);
    tempCtx.lineTo(760, 350);
    tempCtx.lineTo(0, 350);
    tempCtx.closePath();
    tempCtx.fill();
    
    // Set the image source to the canvas data URL
    img.src = tempCanvas.toDataURL('image/png');
}

// Create platforms
function createPlatforms() {
    platforms = [
        { x: 0, y: 450, width: 800, height: 30 },  // Ground
        { x: 200, y: 350, width: 100, height: 20 },
        { x: 400, y: 300, width: 100, height: 20 },
        { x: 600, y: 250, width: 100, height: 20 },
        { x: 300, y: 200, width: 100, height: 20 }
    ];
}

// Create rings
function createRings() {
    rings = [];
    // Add rings on platforms
    platforms.forEach(platform => {
        if (platform.y < 450) { // Not on the ground
            rings.push({
                x: platform.x + platform.width / 2,
                y: platform.y - 30,
                width: 24,
                height: 24,
                collected: false
            });
        }
    });
    
    // Add some random rings
    for (let i = 0; i < 10; i++) {
        rings.push({
            x: 100 + Math.random() * 600,
            y: 100 + Math.random() * 300,
            width: 24,
            height: 24,
            collected: false
        });
    }
}

// Create enemies
function createEnemies() {
    enemies = [
        { x: 300, y: 420, width: 40, height: 30, speed: 2, direction: 1 },
        { x: 500, y: 420, width: 40, height: 30, speed: 3, direction: -1 }
    ];
}

// Key handlers
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        keys.right = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        keys.left = true;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        keys.up = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        keys.space = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        keys.right = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        keys.left = false;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        keys.up = false;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        keys.space = false;
    }
}

// Start/Restart the game
function startGame() {
    // Reset game state
    gameStarted = true;
    gameOver = false;
    score = 0;
    lives = 3;
    sonic.x = 100;
    sonic.y = 400;
    sonic.velocityY = 0;
    sonic.isJumping = false;
    
    // Reset enemies and rings
    createEnemies();
    createRings();
    
    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    
    // Cancel any existing animation loop
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Start new game loop
    gameLoop();
    
    // Remove focus from the button to prevent spacebar from triggering it
    document.getElementById('startButton').blur();
}

// Game loop
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

// Update game state
function update() {
    // Move Sonic
    if (keys.right) {
        sonic.x += sonic.speed;
        sonic.direction = 'right';
    }
    if (keys.left) {
        sonic.x -= sonic.speed;
        sonic.direction = 'left';
    }
    
    // Jump
    if ((keys.up || keys.space) && !sonic.isJumping) {
        sonic.velocityY = -sonic.jumpForce;
        sonic.isJumping = true;
    }
    
    // Apply gravity
    sonic.velocityY += sonic.gravity;
    sonic.y += sonic.velocityY;
    
    // Check platform collisions
    sonic.isJumping = true;
    for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        if (sonic.y + sonic.height > platform.y && 
            sonic.y < platform.y + platform.height && 
            sonic.x + sonic.width > platform.x && 
            sonic.x < platform.x + platform.width) {
            
            // Only collide when falling down
            if (sonic.velocityY > 0) {
                sonic.isJumping = false;
                sonic.y = platform.y - sonic.height;
                sonic.velocityY = 0;
            }
        }
    }
    
    // Check ring collisions
    for (let i = 0; i < rings.length; i++) {
        if (!rings[i].collected && 
            sonic.x + sonic.width > rings[i].x && 
            sonic.x < rings[i].x + rings[i].width && 
            sonic.y + sonic.height > rings[i].y && 
            sonic.y < rings[i].y + rings[i].height) {
            
            rings[i].collected = true;
            score += 10;
            document.getElementById('score').textContent = score;
        }
    }
    
    // Check enemy collisions
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (sonic.x + sonic.width > enemy.x && 
            sonic.x < enemy.x + enemy.width && 
            sonic.y + sonic.height > enemy.y && 
            sonic.y < enemy.y + enemy.height) {
            
            // Check if Sonic is stomping the enemy from above
            if (sonic.velocityY > 0 && sonic.y + sonic.height < enemy.y + 10) {
                // Stomp the enemy
                enemies.splice(i, 1);
                sonic.velocityY = -sonic.jumpForce * 0.8; // Small bounce
                score += 100;
                document.getElementById('score').textContent = score;
                break;
            } else if (!sonic.invulnerable) {
                // Take damage
                lives = Math.max(lives - 1, 0);
                document.getElementById('lives').textContent = lives;
                
                // Reset Sonic position and set invulnerability
                sonic.x = 100;
                sonic.y = 400;
                sonic.velocityY = 0;
                sonic.invulnerable = true;
                sonic.invulnerableTimer = 90; // 1.5 seconds at 60fps
                
                if (lives === 0) {
                    gameOver = true;
                }
                break;
            }
        }
    }
    
    // Move enemies
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;
        
        // Reverse direction at edges
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction *= -1;
        }
    });
    
    // Keep Sonic within bounds
    if (sonic.x < 0) sonic.x = 0;
    if (sonic.x + sonic.width > canvas.width) sonic.x = canvas.width - sonic.width;
    if (sonic.y < 0) sonic.y = 0;
    if (sonic.y + sonic.height > canvas.height) {
        sonic.y = canvas.height - sonic.height;
        sonic.velocityY = 0;
        sonic.isJumping = false;
    }
    
    // Update invulnerability timer
    if (sonic.invulnerable) {
        sonic.invulnerableTimer--;
        if (sonic.invulnerableTimer <= 0) {
            sonic.invulnerable = false;
        }
    }
    
    // Update animation frame
    sonic.frameCount++;
    if (sonic.frameCount >= sonic.frameDelay) {
        sonic.frameCount = 0;
        sonic.currentFrame = (sonic.currentFrame + 1) % 4; // 4 frames for running animation
        sonic.spriteX = sonic.currentFrame * sonic.width;
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    // Draw platforms
    ctx.fillStyle = '#4a7b52';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
    
    // Draw rings
    rings.forEach(ring => {
        if (!ring.collected) {
            ctx.drawImage(ringImg, ring.x, ring.y, ring.width, ring.height);
        }
    });
    
    // Draw enemies
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw Sonic
    // If sprite sheet is not loaded, draw a placeholder
    if (!sonic.spriteSheet.complete) {
        ctx.fillStyle = '#1a75ff';
        ctx.fillRect(sonic.x, sonic.y, sonic.width, sonic.height);
    } else {
        // Draw the sprite from the sprite sheet
        // Parameters: image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
        ctx.save();
        if (sonic.direction === 'left') {
            // Flip horizontally for left direction
            ctx.scale(-1, 1);
            ctx.drawImage(
                sonic.spriteSheet,
                sonic.spriteX, 0, sonic.width, sonic.height,
                -sonic.x - sonic.width, sonic.y, sonic.width, sonic.height
            );
        } else {
            ctx.drawImage(
                sonic.spriteSheet,
                sonic.spriteX, 0, sonic.width, sonic.height,
                sonic.x, sonic.y, sonic.width, sonic.height
            );
        }
        ctx.restore();
    }
}

// Draw start screen
function drawStartScreen() {
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000';
    ctx.font = '30px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Retro Sonic the Hedgehog', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText('Click "Start Game" to play', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Use arrow keys to move, spacebar to jump', canvas.width / 2, canvas.height / 2 + 30);
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = '40px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Click "Start Game" to play again', canvas.width / 2, canvas.height / 2 + 40);
}

// Initialize the game when the page loads
window.onload = init;
