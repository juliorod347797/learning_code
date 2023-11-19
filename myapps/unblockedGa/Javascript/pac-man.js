document.addEventListener("DOMContentLoaded", function () {
    const pacman = document.querySelector(".pacman");
    const walls = document.querySelector(".walls");
  

    let score = 0;
  

    function isWallCollision(newPosition) {
      const wallsRect = walls.getBoundingClientRect();
      const pacmanRect = pacman.getBoundingClientRect();
  
      return (
        newPosition.top < wallsRect.top ||
        newPosition.bottom > wallsRect.bottom ||
        newPosition.left < wallsRect.left ||
        newPosition.right > wallsRect.right
      );
    }
  

    function handlePointCollision(point) {
      point.style.display = "none"; 
      score += 10; 
      console.log("Score:", score);
    }
  

    function movePacman(direction) {
      const pacmanRect = pacman.getBoundingClientRect();
      const speed = 5; 
  
      let newPosition = {
        top: pacmanRect.top,
        bottom: pacmanRect.bottom,
        left: pacmanRect.left,
        right: pacmanRect.right,
      };
  
      switch (direction) {
        case "up":
          newPosition.top -= speed;
          newPosition.bottom -= speed;
          break;
        case "down":
          newPosition.top += speed;
          newPosition.bottom += speed;
          break;
        case "left":
          newPosition.left -= speed;
          newPosition.right -= speed;
          break;
        case "right":
          newPosition.left += speed;
          newPosition.right += speed;
          break;
      }
  
      if (!isWallCollision(newPosition)) {
        pacman.style.top = newPosition.top + "px";
        pacman.style.bottom = newPosition.bottom + "px";
        pacman.style.left = newPosition.left + "px";
        pacman.style.right = newPosition.right + "px";
      }
  

    }
  

    document.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "ArrowUp":
          movePacman("up");
          break;
        case "ArrowDown":
          movePacman("down");
          break;
        case "ArrowLeft":
          movePacman("left");
          break;
        case "ArrowRight":
          movePacman("right");
          break;
      }
    });
  });
  
  