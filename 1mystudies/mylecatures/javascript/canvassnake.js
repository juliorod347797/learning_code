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
Keyboard.ControllerEvents = function (canvas) {

  // Sets
  var self = this;
  this.pressKey = null;
  this.keymap = Keyboard.Keymap;

  // Keydown Event
  window.addEventListener('keydown', function (event) {
    self.pressKey = event.which;

    // Prevent arrow keys from scrolling the entire page
    if ([37, 38, 39, 40].indexOf(self.pressKey) > -1) {
      event.preventDefault();
    }
  });

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
  this.keyEvent = new Keyboard.ControllerEvents(canvas);
  this.width = canvas.width;
  this.height = canvas.height;
  this.length = [];
  this.food = {};
  this.score = 0;
  this.direction = 'right';
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
    this.initSnake();
    this.initFood();
  };
};

/**
 * Game Draw
 */
Game.Draw = function (context, snake) {
  this.context = context;
  this.snake = snake;
  this.isGameOver = false;

  // Draw Stage
  this.drawStage = function () {
    if (this.isGameOver) {
      return;
    }

    // Check Keypress And Set Stage direction
    var keyPress = this.snake.stage.keyEvent.getKey();
    if (typeof (keyPress) != 'undefined') {
      this.snake.stage.direction = keyPress;
    }

    // Draw White Stage
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.snake.stage.width, this.snake.stage.height);

    // Snake Position
    var nx = this.snake.stage.length[0].x;
    var ny = this.snake.stage.length[0].y;

    // Add position by stage direction
    switch (this.snake.stage.direction) {
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
      this.snake.restart();
      this.isGameOver = true;
      return;
    }

    // Logic of Snake food
    if (nx == this.snake.stage.food.x && ny == this.snake.stage.food.y) {
      var tail = { x: nx, y: ny };
      this.snake.stage.score++;
      this.snake.initFood();
    } else {
      var tail = this.snake.stage.length.pop();
      tail.x = nx;
      tail.y = ny;
    }
    this.snake.stage.length.unshift(tail);

    // Draw Snake
    for (var i = 0; i < this.snake.stage.length.length; i++) {
      var cell = this.snake.stage.length[i];
      this.drawCell(cell.x, cell.y, 'blue'); // Change snake color to blue
    }

    // Draw Food
    this.drawCell(this.snake.stage.food.x, this.snake.stage.food.y, 'red'); // Change food color to red

    // Draw Score
    this.context.fillStyle = "black";
    this.context.font = "20px Arial";
    this.context.fillText('Score: ' + this.snake.stage.score, 5, (this.snake.stage.height - 5));

    // Draw Click to Start Text
    if (this.snake.stage.length.length <= 1) {
      this.context.fillStyle = "blue";
      this.context.font = "30px Arial";

      // Adjusted coordinates for better visibility
      this.context.fillText('Click to Start Game', this.snake.stage.width / 6, this.snake.stage.height / 2);
    }
  };

  // Draw Cell
  this.drawCell = function (x, y, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc((x * this.snake.stage.conf.cw + 6), (y * this.snake.stage.conf.cw + 6), 4, 0, 2 * Math.PI, false);
    this.context.fill();
  };

  // Check Collision with walls
  this.collision = function (nx, ny) {
    if (nx == -1 || nx == (this.snake.stage.width / this.snake.stage.conf.cw) || ny == -1 || ny == (this.snake.stage.height / this.snake.stage.conf.cw)) {
      return true;
    }
    return false;
  };
};

/**
 * Game Snake
 */
Game.Snake = function (elementId, conf) {

  // Sets
  var canvas = document.getElementById(elementId);
  var context = canvas.getContext("2d");
  var controller = new Keyboard.ControllerEvents(canvas);
  var snake = new Component.Snake(canvas, conf);
  snake.stage.keyEvent = controller;
  var gameDraw = new Game.Draw(context, snake);

  // Function to start or restart the game
  function startGame() {
    gameDraw.isGameOver = false;
    setInterval(function () { gameDraw.drawStage(); }, snake.stage.conf.fps);
  }

  // Event listener for click to start or restart the game
  canvas.addEventListener('click', function () {
    // If the game is over (snake length is 0), restart the game
    if (snake.stage.length.length === 0 || gameDraw.isGameOver) {
      snake.initSnake();
      snake.initFood();
      gameDraw.isGameOver = false;
      gameDraw.drawStage();
    } else {
      startGame();
    }
  });

  // Initial setup, don't start the game immediately
  snake.initSnake();
  snake.initFood();
  gameDraw.drawStage();
};

/**
 * Window Load
 */
window.onload = function () {
  var snake = new Game.Snake('stage', { fps: 100, size: 4 });
};
