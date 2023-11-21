const pongCanvas = document.getElementById("pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

let pongBallRadius = 10;
let pongX = pongCanvas.width / 2;
let pongY = pongCanvas.height / 2;
let pongDx = 2;
let pongDy = -2;

let pongPaddleHeight = 70;
let pongPaddleWidth = 10;
let leftPaddleY = (pongCanvas.height - pongPaddleHeight) / 2;
let rightPaddleY = (pongCanvas.height - pongPaddleHeight) / 2;

let leftUpPressed = false;
let leftDownPressed = false;
let rightUpPressed = false;
let rightDownPressed = false;

let leftScore = 0;
let rightScore = 0;

let pongGameIsActive = true; // Set to true to start the game immediately

let playAgainTextVisible = false;

document.addEventListener("keydown", pongKeyDownHandler, false);
document.addEventListener("keyup", pongKeyUpHandler, false);

function pongKeyDownHandler(e) {
    if (e.key === "ArrowUp") {
        rightUpPressed = true;
    } else if (e.key === "ArrowDown") {
        rightDownPressed = true;
    }

    if (e.key === "w") {
        leftUpPressed = true;
    } else if (e.key === "s") {
        leftDownPressed = true;
    }
}

function pongKeyUpHandler(e) {
    if (e.key === "ArrowUp") {
        rightUpPressed = false;
    } else if (e.key === "ArrowDown") {
        rightDownPressed = false;
    }

    if (e.key === "w") {
        leftUpPressed = false;
    } else if (e.key === "s") {
        leftDownPressed = false;
    }
}

function updatePaddlePositions() {
    if (rightUpPressed && rightPaddleY > 0) {
        rightPaddleY -= 7;
    } else if (rightDownPressed && rightPaddleY < pongCanvas.height - pongPaddleHeight) {
        rightPaddleY += 7;
    }

    if (leftUpPressed && leftPaddleY > 0) {
        leftPaddleY -= 7;
    } else if (leftDownPressed && leftPaddleY < pongCanvas.height - pongPaddleHeight) {
        leftPaddleY += 7;
    }
}

function pongDraw() {
    pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);

    // Draw middle bar
    pongDrawMiddleBar();

    pongDrawBall();
    pongDrawPaddles();
    pongDrawPlayers();

    pongCollisionDetection();

    updatePaddlePositions(); // Call the function to update paddle positions

    // Update scores and check for winner
    if (pongX + pongDx < pongBallRadius) {
        rightScore++;
        resetGame();
    } else if (pongX + pongDx > pongCanvas.width - pongBallRadius) {
        leftScore++;
        resetGame();
    }

    if (leftScore === 7 || rightScore === 7) {
        // Declare the winner
        pongDrawWinner(leftScore === 7 ? "Left" : "Right");
        playAgainTextVisible = true;
        if (playAgainTextVisible) {
            handlePlayAgainClick();
        }
        return;
    }

    pongX += pongDx;
    pongY += pongDy;

    requestAnimationFrame(pongDraw);
}

function pongDrawPaddles() {
    // Draw left paddle
    pongCtx.beginPath();
    pongCtx.rect(0, leftPaddleY, pongPaddleWidth, pongPaddleHeight);
    pongCtx.fillStyle = "#0095DD";
    pongCtx.fill();
    pongCtx.closePath();

    // Draw right paddle
    pongCtx.beginPath();
    pongCtx.rect(pongCanvas.width - pongPaddleWidth, rightPaddleY, pongPaddleWidth, pongPaddleHeight);
    pongCtx.fillStyle = "#0095DD";
    pongCtx.fill();
    pongCtx.closePath();
}

function pongDrawBall() {
    pongCtx.beginPath();
    pongCtx.arc(pongX, pongY, pongBallRadius, 0, Math.PI * 2);
    pongCtx.fillStyle = "#0095DD";
    pongCtx.fill();
    pongCtx.closePath();
}

function pongDrawPlayers() {
    pongCtx.font = "16px Arial";
    pongCtx.fillStyle = "#0095DD";

    // Player 1 label and score
    pongCtx.fillText("Player 1: " + leftScore, 8, pongCanvas.height - 5);

    // Player 2 label and score
    pongCtx.fillText("Player 2: " + rightScore, pongCanvas.width - 80, pongCanvas.height - 5);
}

function pongDrawMiddleBar() {
    pongCtx.beginPath();
    pongCtx.rect(pongCanvas.width / 2 - 5, 0, 10, pongCanvas.height);
    pongCtx.fillStyle = "#0095DD";
    pongCtx.fill();
    pongCtx.closePath();
}

function pongDrawWinner(winner) {
    pongCtx.font = "30px Arial";
    pongCtx.fillStyle = "#0095DD";
    pongCtx.fillText("Player " + winner + " wins!", pongCanvas.width / 4, pongCanvas.height / 2);
}

function pongCollisionDetection() {
    // Check collision with left paddle
    if (
        pongX + pongDx < pongPaddleWidth &&
        pongY + pongDy > leftPaddleY &&
        pongY + pongDy < leftPaddleY + pongPaddleHeight
    ) {
        pongDx = -pongDx;
    }

    // Check collision with right paddle
    if (
        pongX + pongDx > pongCanvas.width - pongPaddleWidth - pongBallRadius &&
        pongY + pongDy > rightPaddleY &&
        pongY + pongDy < rightPaddleY + pongPaddleHeight
    ) {
        pongDx = -pongDx;
    }

    // Check collision with top wall
    if (pongY + pongDy < pongBallRadius) {
        pongDy = -pongDy;
    }

    // Check collision with bottom wall
    if (pongY + pongDy > pongCanvas.height - pongBallRadius) {
        pongDy = -pongDy;
    }
}

function resetGame() {
    pongX = pongCanvas.width / 2;
    pongY = pongCanvas.height / 2;
    leftPaddleY = (pongCanvas.height - pongPaddleHeight) / 2;
    rightPaddleY = (pongCanvas.height - pongPaddleHeight) / 2;
}

function handlePlayAgainClick() {
    // Your logic for restarting the game goes here
    // For example, resetting scores and calling resetGame()
    leftScore = 0;
    rightScore = 0;
    playAgainTextVisible = false;
    resetGame();
}

// Start the game loop
requestAnimationFrame(pongDraw);
