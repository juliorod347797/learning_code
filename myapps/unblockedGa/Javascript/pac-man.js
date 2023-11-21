const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 30;
const pacSize = gridSize;
const ghostSize = gridSize;
const pelletSize = gridSize / 4;
const cherrySize = gridSize / 2;

const pacSpeed = 2;
const ghostSpeed = 1;

const maze = [
	"#############################",
	"#........#..........#........#",
	"#.####...#...####..#...####.#",
	"#.#..#........#..#.#........#",
	"#...#.#.####.#.#...#.#.####.#",
	"#.###.#.####.#.#.###.#.####.#",
	"#............................#",
	"#.###.#.####.#.#.###.#.####.#",
	"#...#.#.####.#.#...#.#........#",
	"#.#..#........#..#.#.#########",
	"#.####...#...####..#.#........#",
	"#........#..........#...###..#",
	"#.#########.#.###.#.#.#.#.#.#",
	"#.#..#......#...#...#...#.#.#",
	"#.#..#.#####.#.#.###.###.#.#.#",
	"#.#...........#...#...#...#.#",
	"#.####.#######.#.###.#.#####.#",
	"#............................#",
	"#############################",
];

canvas.width = maze[0].length * gridSize;
canvas.height = maze.length * gridSize;

let pacRow = 7;
let pacCol = 10;
let pacDirection = "right";
let pacMouthOpen = true;

let ghostRow = 5;
let ghostCol = 5;
let ghostDirection = "right";

const pellets = [];
const cherries = [
	{ row: 7, col: 14 },
	{ row: 7, col: 15 },
	{ row: 15, col: 7 },
	{ row: 15, col: 8 },
	{ row: 15, col: 9 },
];

function initializePellets() {
	for (let i = 0; i < maze.length; i++) {
		for (let j = 0; j < maze[0].length; j++) {
			if (maze[i][j] === ".") {
				pellets.push({ row: i, col: j });
			}
		}
	}
}

function drawPellets() {
	ctx.fillStyle = "white";
	for (const pellet of pellets) {
		ctx.beginPath();
		ctx.arc(
			pellet.col * gridSize + gridSize / 2,
			pellet.row * gridSize + gridSize / 2,
			pelletSize,
			0,
			2 * Math.PI
		);
		ctx.fill();
		ctx.closePath();
	}
}

function drawCherries() {
	ctx.fillStyle = "red";
	for (const cherry of cherries) {
		ctx.beginPath();
		ctx.arc(
			cherry.col * gridSize + gridSize / 2,
			cherry.row * gridSize + gridSize / 2,
			cherrySize,
			0,
			2 * Math.PI
		);
		ctx.fill();
		ctx.closePath();
	}
}

function drawMaze() {
	ctx.fillStyle = "blue";
	for (let i = 0; i < maze.length; i++) {
		for (let j = 0; j < maze[0].length; j++) {
			if (maze[i][j] === "#") {
				ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
			}
		}
	}
}

function drawPacMan() {
	ctx.fillStyle = "yellow";
	ctx.beginPath();
	const x = pacCol * gridSize + gridSize / 2;
	const y = pacRow * gridSize + gridSize / 2;

	if (pacDirection === "right") {
		ctx.arc(
			x,
			y,
			pacSize / 2,
			pacMouthOpen ? 0.2 : 0.4,
			pacMouthOpen ? 1.9 : 2.1
		);
	} else if (pacDirection === "left") {
		ctx.arc(
			x,
			y,
			pacSize / 2,
			pacMouthOpen ? 1.2 : 1.4,
			pacMouthOpen ? 2.9 : 3.1
		);
	} else if (pacDirection === "up") {
		ctx.arc(
			x,
			y,
			pacSize / 2,
			pacMouthOpen ? 1.7 : 1.9,
			pacMouthOpen ? 0.1 : 0.3
		);
	} else if (pacDirection === "down") {
		ctx.arc(
			x,
			y,
			pacSize / 2,
			pacMouthOpen ? 0.7 : 0.9,
			pacMouthOpen ? 2.1 : 2.3
		);
	}

	ctx.lineTo(x, y);
	ctx.fill();
	ctx.closePath();

	pacMouthOpen = !pacMouthOpen; // Toggle mouth open/close
}

function drawGhost() {
	ctx.fillStyle = "red";
	ctx.beginPath();
	const x = ghostCol * gridSize + gridSize / 2;
	const y = ghostRow * gridSize + gridSize / 2;
	ctx.arc(x, y, ghostSize / 2, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
	clearCanvas();
	drawMaze();
	drawPellets();
	drawCherries();
	drawPacMan();
	drawGhost();
	movePacMan();
	moveGhost();
	checkCollisions();
	requestAnimationFrame(update);
}

function movePacMan() {
	const newRow =
		pacRow +
		(pacDirection === "down"
			? pacSpeed
			: pacDirection === "up"
			? -pacSpeed
			: 0);
	const newCol =
		pacCol +
		(pacDirection === "right"
			? pacSpeed
			: pacDirection === "left"
			? -pacSpeed
			: 0);

	if (isValidMove(newRow, newCol)) {
		pacRow = newRow;
		pacCol = newCol;
	}
}

function moveGhost() {
	const newRow =
		ghostRow +
		(ghostDirection === "down"
			? ghostSpeed
			: ghostDirection === "up"
			? -ghostSpeed
			: 0);
	const newCol =
		ghostCol +
		(ghostDirection === "right"
			? ghostSpeed
			: ghostDirection === "left"
			? -ghostSpeed
			: 0);

	if (isValidMove(newRow, newCol)) {
		ghostRow = newRow;
		ghostCol = newCol;
	} else {
		// Randomly change direction when hitting a wall
		const directions = ["up", "down", "left", "right"];
		ghostDirection =
			directions[Math.floor(Math.random() * directions.length)];
	}
}

function isValidMove(row, col) {
	return (
		row >= 0 &&
		row < maze.length &&
		col >= 0 &&
		col < maze[0].length &&
		maze[row][col] !== "#"
	);
}

function checkCollisions() {
	const pacTop = pacRow * gridSize;
	const pacLeft = pacCol * gridSize;
	const pacCenterX = pacLeft + pacSize / 2;
	const pacCenterY = pacTop + pacSize / 2;

	const ghostTop = ghostRow * gridSize;
	const ghostLeft = ghostCol * gridSize;
	const ghostCenterX = ghostLeft + ghostSize / 2;
	const ghostCenterY = ghostTop + ghostSize / 2;

	for (let i = 0; i < pellets.length; i++) {
		const pellet = pellets[i];
		const pelletX = pellet.col * gridSize + gridSize / 2;
		const pelletY = pellet.row * gridSize + gridSize / 2;

		const distance = Math.sqrt(
			(pacCenterX - pelletX) ** 2 + (pacCenterY - pelletY) ** 2
		);
		if (distance < pacSize / 2 + pelletSize) {
			pellets.splice(i, 1);
			i--;
		}
	}

	for (const cherry of cherries) {
		const cherryX = cherry.col * gridSize + gridSize / 2;
		const cherryY = cherry.row * gridSize + gridSize / 2;

		const distance = Math.sqrt(
			(pacCenterX - cherryX) ** 2 + (pacCenterY - cherryY) ** 2
		);
		if (distance < pacSize / 2 + cherrySize) {
			// Bonus points for eating a cherry
			alert("You got a cherry! Bonus points!");
			cherries.splice(cherries.indexOf(cherry), 1);
		}
	}

	const distanceToGhost = Math.sqrt(
		(pacCenterX - ghostCenterX) ** 2 + (pacCenterY - ghostCenterY) ** 2
	);
	if (distanceToGhost < pacSize / 2 + ghostSize / 2) {
		alert("Game Over! You got caught by the ghost.");
		resetGame();
	}

	if (pellets.length === 0 && cherries.length === 0) {
		alert("Congratulations! You won!");
		resetGame();
	}
}

function resetGame() {
	pacRow = 7;
	pacCol = 10;
	pacDirection = "right";
	pacMouthOpen = true;

	ghostRow = 5;
	ghostCol = 5;
	ghostDirection = "right";

	pellets.length = 0;
	cherries.length = 0;
	initializePellets();
	cherries.push(
		{ row: 7, col: 14 },
		{ row: 7, col: 15 },
		{ row: 15, col: 7 },
		{ row: 15, col: 8 },
		{ row: 15, col: 9 }
	);
}

function handleKeyPress(e) {
	switch (e.key) {
		case "ArrowUp":
			pacDirection = "up";
			break;
		case "ArrowDown":
			pacDirection = "down";
			break;
		case "ArrowLeft":
			pacDirection = "left";
			break;
		case "ArrowRight":
			pacDirection = "right";
			break;
	}
}

document.addEventListener("keydown", handleKeyPress);

initializePellets();
update();
