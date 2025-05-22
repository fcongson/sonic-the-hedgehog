const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate Sonic sprite sheet
function generateSonicSprite() {
    console.log('Generating Sonic sprite sheet...');
    const canvas = createCanvas(192, 48);
    const ctx = canvas.getContext('2d');
    
    // Colors
    const blueColor = '#1a75ff';
    const skinColor = '#ffcc99';
    const shoeColor = '#ff3300';
    
    // Draw 4 frames of animation
    for (let frame = 0; frame < 4; frame++) {
        const x = frame * 48;
        
        // Body
        ctx.fillStyle = blueColor;
        ctx.beginPath();
        ctx.ellipse(x + 24, 24, 16, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Face
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.ellipse(x + 28, 20, 10, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(x + 32, 18, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(x + 33, 18, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shoes
        ctx.fillStyle = shoeColor;
        
        // Different leg positions for each frame
        if (frame === 0) {
            ctx.fillRect(x + 16, 38, 10, 6);
            ctx.fillRect(x + 28, 38, 10, 6);
        } else if (frame === 1) {
            ctx.fillRect(x + 14, 36, 10, 8);
            ctx.fillRect(x + 30, 38, 10, 6);
        } else if (frame === 2) {
            ctx.fillRect(x + 16, 38, 10, 6);
            ctx.fillRect(x + 28, 38, 10, 6);
        } else {
            ctx.fillRect(x + 16, 38, 10, 6);
            ctx.fillRect(x + 30, 36, 10, 8);
        }
        
        // Spikes
        ctx.fillStyle = blueColor;
        ctx.beginPath();
        ctx.moveTo(x + 12, 16);
        ctx.lineTo(x + 4, 24);
        ctx.lineTo(x + 12, 28);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + 14, 12);
        ctx.lineTo(x + 8, 6);
        ctx.lineTo(x + 18, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + 20, 10);
        ctx.lineTo(x + 16, 2);
        ctx.lineTo(x + 24, 8);
        ctx.closePath();
        ctx.fill();
    }
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'sonic-sprite.png'), buffer);
    console.log('Sonic sprite sheet created successfully!');
}

// Generate ring
function generateRing() {
    console.log('Generating ring...');
    const canvas = createCanvas(24, 24);
    const ctx = canvas.getContext('2d');
    
    // Outer ring
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(12, 12, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner hole
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(12, 12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Shine effect
    ctx.fillStyle = '#ffffcc';
    ctx.beginPath();
    ctx.arc(8, 8, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'ring.png'), buffer);
    console.log('Ring created successfully!');
}

// Generate enemy
function generateEnemy() {
    console.log('Generating enemy...');
    const canvas = createCanvas(40, 30);
    const ctx = canvas.getContext('2d');
    
    // Body
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.ellipse(20, 15, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(14, 12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(26, 12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(14, 12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(26, 12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Spikes
    ctx.fillStyle = '#cc0000';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(8 + i * 6, 22);
        ctx.lineTo(11 + i * 6, 28);
        ctx.lineTo(14 + i * 6, 22);
        ctx.closePath();
        ctx.fill();
    }
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'enemy.png'), buffer);
    console.log('Enemy created successfully!');
}

// Generate background
function generateBackground() {
    console.log('Generating background...');
    const canvas = createCanvas(760, 480);
    const ctx = canvas.getContext('2d');
    
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 300);
    skyGradient.addColorStop(0, '#87ceeb');
    skyGradient.addColorStop(1, '#e0f7ff');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Sun
    ctx.fillStyle = '#ffff99';
    ctx.beginPath();
    ctx.arc(100, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // Cloud 1
    drawCloud(ctx, 150, 100, 1);
    // Cloud 2
    drawCloud(ctx, 400, 70, 1.2);
    // Cloud 3
    drawCloud(ctx, 650, 120, 0.8);
    
    // Hills
    ctx.fillStyle = '#7cbb00';
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.bezierCurveTo(200, 280, 300, 300, 500, 320);
    ctx.bezierCurveTo(650, 330, 750, 350, 760, 350);
    ctx.lineTo(760, 480);
    ctx.lineTo(0, 480);
    ctx.closePath();
    ctx.fill();
    
    // Mountains in background
    ctx.fillStyle = '#6b8e23';
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(150, 200);
    ctx.lineTo(250, 280);
    ctx.lineTo(350, 180);
    ctx.lineTo(500, 300);
    ctx.lineTo(600, 220);
    ctx.lineTo(760, 300);
    ctx.lineTo(760, 350);
    ctx.lineTo(0, 350);
    ctx.closePath();
    ctx.fill();
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'background.png'), buffer);
    console.log('Background created successfully!');
}

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

// Generate all assets
try {
    generateSonicSprite();
    generateRing();
    generateEnemy();
    generateBackground();
    console.log('All assets generated successfully!');
} catch (error) {
    console.error('Error generating assets:', error);
}
