/**
 * Namespace
 */
var Game = Game || {};
var Keyboard = Keyboard || {};
var Component = Component || {};

/**
 * Keyboard Map
 */
Keyboard.Keymap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

/**
 * Keyboard Events
 */
Keyboard.ControllerEvents = function () {
  // Setts
  var self = this;
  this.pressKey = null;
  this.keymap = Keyboard.Keymap;

  // Keydown Event
  document.onkeydown = function (event) {
    self.pressKey = event.which;
    // Prevent the default behavior of arrow keys
    if ([37, 38, 39, 40].includes(event.which)) {
      event.preventDefault();
    }
  };

  // Get Key
  this.getKey = function () {
    return this.keymap[this.pressKey];
  };
};

/**
 * Game Component Stage
 */
Component.Stage = function (canvas, conf) {
  // Sets
  this.keyEvent = new Keyboard.ControllerEvents();
  this.width = canvas.width;
  this.height = canvas.height;
  this.length = [];
  this.food = {};
  this.score = 0;
  this.direction = 'right';
  this.lives = 3; // Added lives property
  this.conf = {
    cw: 10,
    size: 5,
    fps: 100
  };

  // Merge Conf
  if (typeof conf == 'object') {
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) {
        this.conf[key] = conf[key];
      }
    }
  }
};

/**
 * Game Component Snake
 */
Component.Snake = function (canvas, conf) {
  // Game Stage
  this.stage = new Component.Stage(canvas, conf);

  // Init Snake
  this.initSnake = function () {
    // Iteration in Snake Conf Size
    for (var i = 0; i < this.stage.conf.size; i++) {
      // Add Snake Cells
      this.stage.length.push({ x: i, y: 0 });
    }
  };

  // Call init Snake
  this.initSnake();

  // Init Food
  this.initFood = function () {
    // Add food on stage
    this.stage.food = {
      x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw),
      y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw),
    };
  };

  // Init Food
  this.initFood();

  // Restart Stage
  this.restart = function () {
    this.stage.length = [];
    this.stage.food = {};
    this.stage.score = 0;
    this.stage.direction = 'right';
    this.stage.keyEvent.pressKey = null;
    this.stage.lives = 3; // Reset lives
    this.initSnake();
    this.initFood();
  };

  // Handle Collision
  this.handleCollision = function () {
    this.stage.lives--;

    if (this.stage.lives > 0) {
      // If there are remaining lives, restart the game
      this.restart();
    } else {
      // If no lives left, display game over message
      alert('Game Over! Click to play again.');
      this.restart();
    }
  };

  // Initial call to start the game
  this.restart();
};

/**
 * Game Draw
 */
Game.Draw = function (context, snake) {
  // Draw Stage
  this.drawStage = function () {
    // Check Keypress And Set Stage direction
    var keyPress = snake.stage.keyEvent.getKey();
    if (typeof (keyPress) != 'undefined') {
      snake.stage.direction = keyPress;
    }

    // Draw White Stage
    context.fillStyle = "white";
    context.fillRect(0, 0, snake.stage.width, snake.stage.height);

    // Snake Position
    var nx = snake.stage.length[0].x;
    var ny = snake.stage.length[0].y;

    // Add position by stage direction
    switch (snake.stage.direction) {
      case 'right':
        nx++;
        break;
      case 'left':
        nx--;
        break;
      case 'up':
        ny--;
        break;
      case 'down':
        ny++;
        break;
    }

    // Check Collision
    if (this.collision(nx, ny) == true) {
      snake.handleCollision();
      return;
    }

    // Logic of Snake food
    if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
      var tail = { x: nx, y: ny };
      snake.stage.score++;
      snake.initFood();
    } else {
      var tail = snake.stage.length.pop();
      tail.x = nx;
      tail.y = ny;
    }
    snake.stage.length.unshift(tail);

    // Draw Snake
    for (var i = 0; i < snake.stage.length.length; i++) {
      var cell = snake.stage.length[i];
      this.drawCell(cell.x, cell.y);
    }

    // Draw Food
    this.drawCell(snake.stage.food.x, snake.stage.food.y);

    // Draw Score
    context.fillText('Score: ' + snake.stage.score + ' Lives: ' + snake.stage.lives, 5, (snake.stage.height - 5));

    // Display "Click to Start" message if the game hasn't started yet
    if (snake.stage.length.length === 0) {
      context.fillStyle = 'black';
      context.font = '20px Arial';
      context.fillText('Click to Start', snake.stage.width / 2 - 70, snake.stage.height / 2);
    }
  };

  // Draw Cell
  this.drawCell = function (x, y) {
    context.fillStyle = 'rgb(170, 170, 170)';
    context.beginPath();
    context.arc((x * snake.stage.conf.cw + 6), (y * snake.stage.conf.cw + 6), 4, 0, 2 * Math.PI, false);
    context.fill();
  };

  // Check Collision with walls
  this.collision = function (nx, ny) {
    if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw)) {
      return true;
    }
    return false;
  }
};

/**
 * Window Load
 */
window.onload = function () {
  var canvas = document.getElementById('stage');
  var context = canvas.getContext("2d");
  var snake = new Component.Snake(canvas, { fps: 100, size: 4 });
  var gameDraw = new Game.Draw(context, snake);

  // Game Interval
  var gameInterval;

  // Function to start the game
  var startGame = function () {
    gameInterval = setInterval(function () {
      gameDraw.drawStage();
    }, snake.stage.conf.fps);
  };

  // Start the game on click
  canvas.addEventListener('click', function () {
    if (snake.stage.length.length === 0) {
      snake.restart();
      startGame();
    }
  });

  // Initial start of the game
  startGame();
};
