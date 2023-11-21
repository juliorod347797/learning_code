// Tetris Game
const tetrisCanvas = document.getElementById("tetrisCanvas");
const tetrisCtx = tetrisCanvas.getContext("2d");

const TETRIS_ROWS = 20;
const TETRIS_COLS = 10;
const TETRIS_BLOCK_SIZE = 30;
let gameIsActive = false;

tetrisCanvas.width = TETRIS_COLS * TETRIS_BLOCK_SIZE;
tetrisCanvas.height = TETRIS_ROWS * TETRIS_BLOCK_SIZE;

function showClickToStartMessage() {
    tetrisCtx.fillStyle = "#000";
    tetrisCtx.font = "30px Arial";
    tetrisCtx.fillText("Click to Start", tetrisCanvas.width / 4, tetrisCanvas.height / 2);
}

showClickToStartMessage();

// Event listener for mouse click
tetrisCanvas.addEventListener("click", function () {
    if (gameIsActive) {
        // Game is already active, do nothing
        return;
    }

    // Clear the board and start the game
    tetrisBoard.forEach(row => row.fill(0));
    startGame();
});

const tetrisBoard = [];
for (let i = 0; i < TETRIS_ROWS; i++) {
    tetrisBoard[i] = [];
    for (let j = 0; j < TETRIS_COLS; j++) {
        tetrisBoard[i][j] = 0;
    }
}

// Tetris pieces and their colors
const tetrisPieces = [
    [[1, 1, 1, 1]],    // I piece
    [[1, 1, 1], [1]],  // L piece
    [[1, 1, 1], [0, 0, 1]],  // J piece
    [[1, 1], [1, 1]],  // O piece
    [[1, 1, 1], [0, 1]],    // T piece
];

const tetrisPieceColors = ["#00F", "#F90", "#F00", "#0F0", "#F0F"];

// Current falling piece
let currentPiece = {
    shape: [],
    color: "",
    x: 0,
    y: 0,
};

// Arrow key controls
let isLeftKeyPressed = false;
let isRightKeyPressed = false;
let isDownKeyPressed = false;
let isRotateKeyPressed = false;

// Time intervals for automatic and manual moves
const moveDownInterval = 500; // milliseconds
const manualMoveSpeed = 50; // milliseconds

let lastMoveTime = Date.now();
let manualMoveLastTime = Date.now();

// Function to start the game
function startGame() {
    gameIsActive = true;
    currentPiece = getRandomPiece();
    lastMoveTime = Date.now();
    manualMoveLastTime = Date.now();
    gameLoop();
}

// Function to end the game and show the "Click to Play Again" message
function endGame() {
    gameIsActive = false;
    tetrisCtx.fillStyle = "#000";
    tetrisCtx.font = "30px Arial";
    tetrisCtx.fillText("Game Over. Click to Play Again", tetrisCanvas.width / 6, tetrisCanvas.height / 2);
    tetrisCanvas.addEventListener("click", restartGame);
}

// Function to restart the game
function restartGame() {
    tetrisCanvas.removeEventListener("click", restartGame);
    tetrisBoard.forEach(row => row.fill(0));
    startGame();
}

// Event listener for mouse click
tetrisCanvas.addEventListener("click", function () {
    if (gameIsActive) {
        // Game is already active, do nothing
        return;
    }

    // Clear the board and start the game
    tetrisBoard.forEach(row => row.fill(0));
    startGame();
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "ArrowLeft") {
        isLeftKeyPressed = true;
    } else if (e.key === "ArrowRight") {
        isRightKeyPressed = true;
    } else if (e.key === "ArrowDown" && !isDownKeyPressed) {
        isDownKeyPressed = true;
        movePieceDownManually();  // Move the piece down once when the key is pressed
    } else if (e.key === "ArrowUp") {
        isRotateKeyPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowLeft") {
        isLeftKeyPressed = false;
    } else if (e.key === "ArrowRight") {
        isRightKeyPressed = false;
    } else if (e.key === "ArrowDown") {
        isDownKeyPressed = false;
    }
}

function getRandomPiece() {
    const randomIndex = Math.floor(Math.random() * tetrisPieces.length);
    const piece = tetrisPieces[randomIndex];
    const color = tetrisPieceColors[randomIndex];
    return { shape: piece, color, x: Math.floor((TETRIS_COLS - piece[0].length) / 2), y: 0 };
}

function drawTetrisSquare(x, y, color) {
    tetrisCtx.fillStyle = color;
    tetrisCtx.fillRect(x * TETRIS_BLOCK_SIZE, y * TETRIS_BLOCK_SIZE, TETRIS_BLOCK_SIZE, TETRIS_BLOCK_SIZE);
    tetrisCtx.strokeStyle = "#000";
    tetrisCtx.strokeRect(x * TETRIS_BLOCK_SIZE, y * TETRIS_BLOCK_SIZE, TETRIS_BLOCK_SIZE, TETRIS_BLOCK_SIZE);
}

function drawTetrisBoard() {
    for (let i = 0; i < TETRIS_ROWS; i++) {
        for (let j = 0; j < TETRIS_COLS; j++) {
            if (tetrisBoard[i][j] !== 0) {
                drawTetrisSquare(j, i, tetrisBoard[i][j]);
            }
        }
    }
}

function drawCurrentPiece() {
    const pieceShape = currentPiece.shape;
    const pieceColor = currentPiece.color;

    for (let i = 0; i < pieceShape.length; i++) {
        for (let j = 0; j < pieceShape[i].length; j++) {
            if (pieceShape[i][j] !== 0) {
                drawTetrisSquare(currentPiece.x + j, currentPiece.y + i, pieceColor);
            }
        }
    }
}

function clearRows() {
    for (let i = TETRIS_ROWS - 1; i >= 0; i--) {
        if (tetrisBoard[i].every(cell => cell !== 0)) {
            tetrisBoard.splice(i, 1);
            tetrisBoard.unshift(Array(TETRIS_COLS).fill(0));
        }
    }
}

function checkCollision() {
    const pieceShape = currentPiece.shape;
    for (let i = 0; i < pieceShape.length; i++) {
        for (let j = 0; j < pieceShape[i].length; j++) {
            if (pieceShape[i][j] !== 0) {
                const boardX = currentPiece.x + j;
                const boardY = currentPiece.y + i;

                // Check if the piece is outside the boundaries or collides with filled cells on the board
                if (
                    boardY >= TETRIS_ROWS ||
                    boardX < 0 ||
                    boardX >= TETRIS_COLS ||
                    (boardY >= 0 && tetrisBoard[boardY][boardX] !== 0)
                ) {
                    return true; // Collision detected
                }
            }
        }
    }
    return false; // No collision
}

function placePieceOnBoard() {
    const pieceShape = currentPiece.shape;
    const pieceColor = currentPiece.color;
    for (let i = 0; i < pieceShape.length; i++) {
        for (let j = 0; j < pieceShape[i].length; j++) {
            if (pieceShape[i][j] !== 0) {
                tetrisBoard[currentPiece.y + i][currentPiece.x + j] = pieceColor;
            }
        }
    }

    clearRows();
}

function movePieceDown() {
    currentPiece.y++;

    if (checkCollision()) {
        currentPiece.y--; // Move back if collision detected
        placePieceOnBoard();
        currentPiece = getRandomPiece();

        // Check for game over condition
        if (checkCollision()) {
            endGame();
        }
    }
}

function movePieceLeft() {
    currentPiece.x--;

    if (checkCollision()) {
        currentPiece.x++; // Move back if collision detected
    }
}

function movePieceRight() {
    currentPiece.x++;

    if (checkCollision()) {
        currentPiece.x--; // Move back if collision detected
    }
}

function rotatePiece() {
    const originalPiece = currentPiece.shape;
    const rotatedPiece = [];

    for (let i = 0; i < originalPiece[0].length; i++) {
        rotatedPiece[i] = [];
        for (let j = 0; j < originalPiece.length; j++) {
            rotatedPiece[i][j] = originalPiece[originalPiece.length - 1 - j][i];
        }
    }

    currentPiece.shape = rotatedPiece;

    if (checkCollision()) {
        currentPiece.shape = originalPiece; // Revert if collision detected
    }
}

function movePieceDownManually() {
    movePieceDown();
    manualMoveLastTime = Date.now();
}

function handleManualMoves() {
    const currentTime = Date.now();

    if (isLeftKeyPressed && currentTime - manualMoveLastTime > manualMoveSpeed) {
        movePieceLeft();
        manualMoveLastTime = currentTime;
    }

    if (isRightKeyPressed && currentTime - manualMoveLastTime > manualMoveSpeed) {
        movePieceRight();
        manualMoveLastTime = currentTime;
    }

    if (isDownKeyPressed && currentTime - manualMoveLastTime > manualMoveSpeed) {
        movePieceDownManually();
        manualMoveLastTime = currentTime;
    }

    if (isRotateKeyPressed) {
        rotatePiece();
        isRotateKeyPressed = false;
    }
}

function gameLoop() {
    if (!gameIsActive) {
        return;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - lastMoveTime;

    if (elapsedTime > moveDownInterval) {
        movePieceDown();
        lastMoveTime = currentTime;
    }

    handleManualMoves();

    tetrisCtx.clearRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);

    drawTetrisBoard();
    drawCurrentPiece();

    requestAnimationFrame(gameLoop);
}
