let canvas;
let context;
let previousTimestamp;
let width;
let height;

window.onload = init;

function init(){
    canvas = document.getElementById("viewport");
    context = canvas.getContext("2d");
    readWindowDimensions();
    start();
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    readWindowDimensions();
    canvas.width = width;
    canvas.height = height;
    update(timestamp);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    draw();
    previousTimestamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}

function readWindowDimensions() {
    width = window.innerWidth;
    height = window.innerHeight;
}

let pieceSprites;
let pieces;
let spritesReady;
let pieceSpriteNames;
let gravity = 9.82;

function start() {
    spritesReady = false;
    pieces = new Array();
    directoryName = "sprites/pieces/"
    pieceSpriteNames = [
        "white_bishop.png",
        "white_bishop.png",
        "white_king.png",
        "white_knight.png",
        "white_knight.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_pawn.png",
        "white_queen.png",
        "white_rook.png",
        "white_rook.png",
        "black_bishop.png",
        "black_bishop.png",
        "black_king.png",
        "black_knight.png",
        "black_knight.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_pawn.png",
        "black_queen.png",
        "black_rook.png",
        "black_rook.png"
    ]

    pieceSpriteNames.forEach((filename) => loadSprite(directoryName + filename));
}

function loadSprite(filename) {
    let sprite = new Image();
    sprite.src = filename;
    sprite.onload = function() {
        let piece = createPiece(sprite, randomUpperCanvasPosition(), [randomRange(-100, 100), 0]);
        pieces.push(piece);
        spritesReady = pieces.length === pieceSpriteNames.length;
    };
}

function createPiece(sprite, position, velocity) {
    let newPiece = {};
    newPiece.sprite = sprite;
    newPiece.position = position;
    newPiece.velocity = velocity;
    newPiece.width = sprite.width;
    newPiece.height = sprite.height;
    return newPiece;
}

function randomUpperCanvasPosition() {
    let position = [randomRange(0, width), randomRange(0, 0.4 * height)];
    return position;
}

function randomCanvasPosition() {
    let position = [randomRange(0, width), randomRange(0, height)];
    return position;
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function update(timestamp) {
    let deltaTime = timestamp - previousTimestamp;

    if(spritesReady) {
        pieces.forEach((piece) => updatePiece(piece, deltaTime));
    }
}

function updatePiece(piece, deltaTime) {
    let scaledDeltaTime = deltaTime * 0.02;
    let [currentXVelocity, currentYVelocity] = piece.velocity;
    let newXVelocity = currentXVelocity;
    let newYVelocity = currentYVelocity + gravity * scaledDeltaTime;
    let [currentX, currentY] = piece.position;
    let deltaX = newXVelocity * scaledDeltaTime;
    let deltaY = newYVelocity * scaledDeltaTime;
    let newX = currentX + deltaX;
    let newY = currentY + deltaY;
    if(newX < 0) {
        newXVelocity = -newXVelocity;
        newX = -newX;
    }
    if(newX + piece.width > width) {
        newXVelocity = -newXVelocity;
        newX = width - piece.width - (newX + piece.width - width);
    }
    if(newY < 0) {
        newYVelocity = -newYVelocity;
        newY = -newY;
    }
    if(newY + piece.height > height) {
        newYVelocity = -newYVelocity;
        newY = height - piece.height - (newY + piece.height - height);
    }
    piece.position = [newX, newY];
    piece.velocity = [newXVelocity, newYVelocity];
}

function draw() {
    if(spritesReady) {
        pieces.forEach(drawPiece);
    }
}

function drawPiece(piece) {
    let [x, y] = piece.position;
    context.drawImage(piece.sprite, x, y);
}