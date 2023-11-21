var canvas = document.getElementById('tetris');

// Check if the canvas element is found
if (!canvas) {
    console.error("Canvas element 'tetris' not found.");
} else {
    var context = canvas.getContext('2d');
    // ... rest of your Tetris game code
}

let nextTetromino;

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const previewBlockSize = BLOCK_SIZE / 2;
const canvasWidth = canvas.width;

const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];

const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1, 1], [1]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 1], [0, 1]],
    [[1, 1, 1], [1, 0]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]]
];

function getRandomTetromino() {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    return SHAPES[randomIndex].map(row => [...row]);
}

let board = createEmptyBoard();
let currentTetromino;
let currentPosition;
let currentColor;
let isPlaying = false;

canvas.addEventListener('click', canvasClickHandler);

function canvasClickHandler(event) {
    if (!isPlaying) {
        isPlaying = true;
        initializeTetrisGame();
        gameLoop();
    }
}

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft') {
        // Handle left arrow key press
        moveTetromino('left');
    } else if (event.key === 'ArrowRight') {
        // Handle right arrow key press
        moveTetromino('right');
    } else if (event.key === 'ArrowDown') {
        // Handle down arrow key press
        moveTetromino('down');
    } else if (event.key === 'ArrowUp') {
        // Handle up arrow key press
        rotateTetromino();
    }
    // Add more conditions as needed based on your game controls
}

// Add the event listener for keydown events
document.addEventListener("keydown", handleKeyPress);

function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
}

function initializeTetrisGame() {
    isPlaying = true;
    currentTetromino = getRandomTetromino();
    nextTetromino = getRandomTetromino();
    score = 0;

    initializeBoard();
    drawNextTetromino();

    document.addEventListener("keydown", handleKeyPress);

    draw();
    update();
    gameLoop();
}

function initializeBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            board[row][col] = 0;
        }
    }
}

function drawClickToPlayButton() {
    context.fillStyle = '#000';
    context.fillRect(canvas.width / 4, canvas.height / 2 - 25, canvas.width / 2, 50);

    context.fillStyle = '#FFF';
    context.font = '20px Arial';
    context.fillText('Click to Play', 90, 285);
}

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = '#fff';
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, COLORS[board[row][col] - 1]);
            }
        }
    }
}

function drawNextTetromino() {
    if (nextTetromino) {
        context.fillStyle = '#000';
        context.fillRect(COLUMNS * BLOCK_SIZE + 20, 20, 5 * previewBlockSize, 5 * previewBlockSize);

        nextTetromino.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    const x = COLUMNS * BLOCK_SIZE + 20 + j * previewBlockSize;
                    const y = 20 + i * previewBlockSize;
                    drawBlockInPreview(x, y, COLORS[value - 1]);
                }
            });
        });
    }
}

function drawTetromino() {
    if (currentTetromino && currentPosition && currentColor) {
        // Clear the previous position of the tetromino
        currentTetromino.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    drawBlock(currentPosition.x + j, currentPosition.y + i, '#000'); // Use the background color to clear
                }
            });
        });

        // Draw the tetromino at the new position
        currentTetromino.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    drawBlock(currentPosition.x + j, currentPosition.y + i, currentColor);
                }
            });
        });
    }
}

function drawBlockInPreview(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, BLOCK_SIZE / 2, BLOCK_SIZE / 2);
    context.strokeStyle = '#fff';
    context.strokeRect(x, y, BLOCK_SIZE / 2, BLOCK_SIZE / 2);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawTetromino();
    drawNextTetromino();
}

function update() {
    placeTetromino();
    removeFullRows();
    currentTetromino = getRandomTetromino();
    currentPosition = { x: Math.floor(COLUMNS / 2) - 1, y: 0 };
    currentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (checkCollision()) {
        isPlaying = false;
        alert('Game Over! Click to play again.');
        board = createEmptyBoard();
    }
}

function placeTetromino() {
    if (currentTetromino && currentPosition && currentColor) {
        currentTetromino.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    board[currentPosition.y + i][currentPosition.x + j] = currentColor;
                }
            });
        });
    }
}

function checkCollision(position, tetromino) {
    if (tetromino) {
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[i].length; j++) {
                if (
                    tetromino[i][j] &&
                    (board[position.y + i] && board[position.y + i][position.x + j]) !== 0
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}



function rotateTetromino() {
    const rotatedTetromino = [];
    for (let i = 0; i < currentTetromino[0].length; i++) {
        const newRow = currentTetromino.map(row => row[i]).reverse();
        rotatedTetromino.push(newRow);
    }

    const canRotate = !checkCollision(currentPosition, rotatedTetromino);

    if (canRotate) {
        currentTetromino = rotatedTetromino;
    }
}

function moveTetromino(direction) {
    const newPosition = { ...currentPosition };

    if (direction === 'left') {
        newPosition.x -= 1;
    } else if (direction === 'right') {
        newPosition.x += 1;
    } else if (direction === 'down') {
        newPosition.y += 1;
    }

    const canMove = !checkCollision(newPosition, currentTetromino);

    if (canMove) {
        currentPosition = newPosition;
    }
}

function removeFullRows() {
    const fullRows = [];
    for (let i = 0; i < ROWS; i++) {
        if (board[i].every(cell => cell !== 0)) {
            fullRows.push(i);
        }
    }

    for (let i = fullRows.length - 1; i >= 0; i--) {
        const row = fullRows[i];
        board.splice(row, 1);
        board.unshift(Array(COLUMNS).fill(0));
    }
}


function gameLoop() {
    draw();
    update();
    if (isPlaying) {
        requestAnimationFrame(gameLoop);
    }
}

initializeTetrisGame();
