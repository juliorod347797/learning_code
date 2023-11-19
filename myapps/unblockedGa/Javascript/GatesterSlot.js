(function () {
	// Array of items that will appear on the slot machine doors
	const items = [
	  "🍭",
	  "❌",
	  "⛄️",
	  "🦄",
	  "🍌",
	  "💩",
	  "👻",
	  "😻",
	  "💵",
	  "🤡",
	  "🦖",
	  "🍎",
	  "😂",
	  "🖕",
	];
  
	// Selecting all elements with the class 'door' and storing them in 'doors'
	const doors = document.querySelectorAll(".door");
  
	// Loading sounds for the slot machine
	const coinSound = new Audio("../music/coininsert.mp3");
	const spinSound = new Audio("../music/wheelspinslot.mp3");
  
	// Event listener for the 'spinner' button, triggering the 'spin' function
	document.querySelector("#spinner").addEventListener("click", spin);
  
	// Event listener for the 'reseter' button, calling the 'init' function with default values
	document.querySelector("#reseter").addEventListener("click", init);
  
	// Initializing the slot machine
	function init(firstInit = true, groups = 1, duration = 1) {
	  for (const door of doors) {
		// Resetting or initializing the 'spinned' data attribute for each door
		if (firstInit) {
		  door.dataset.spinned = "0";
		} else if (door.dataset.spinned === "1") {
		  const boxes = door.querySelector(".boxes");
		  return;
		}
  
		// Creating a clone of the door's boxes for animation
		const boxes = door.querySelector(".boxes");
		const boxesClone = boxes.cloneNode(false);
		const pool = ["❓"]; // Placeholder item while spinning
  
		if (!firstInit) {
		  // Adding transition event listeners to the boxes for animation effects
		  const arr = [];
		  for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
			arr.push(...items);
		  }
		  pool.push(...shuffle(arr));
  
		  boxesClone.addEventListener(
			"transitionstart",
			function () {
			  door.dataset.spinned = "1";
			  this.querySelectorAll(".box").forEach((box) => {
				box.style.filter = "blur(1px)";
			  });
			},
			{ once: true }
		  );
  
		  boxesClone.addEventListener(
			"transitionend",
			function () {
			  this.querySelectorAll(".box").forEach((box, index) => {
				box.style.filter = "blur(0)";
				if (index > 0) this.removeChild(box);
			  });
			},
			{ once: true }
		  );
		}
  
		// Creating and appending boxes with items to the door for display
		for (let i = pool.length - 1; i >= 0; i--) {
		  const box = document.createElement("div");
		  box.classList.add("box");
		  box.style.width = door.clientWidth + "px";
		  box.style.height = door.clientHeight + "px";
		  box.textContent = pool[i];
		  boxesClone.appendChild(box);
		}
  
		// Setting up transition properties for the animation
		boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
		boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
		door.replaceChild(boxesClone, boxes);
	  }
	}
  
// Function to initiate the spinning of the slot machine
function spin() {
	coinSound.play(); // Playing the coin sound
	init(false, 1, 2); // Initiating spinning animation
  
	// Delaying the spinning sound to create a sequence effect
	setTimeout(() => {
	  spinSound.play(); // Playing the spinning sound
  
	  // Looping through each door for the spinning animation effect
	  for (const door of doors) {
		const boxes = door.querySelector(".boxes");
		const duration = parseFloat(boxes.style.transitionDuration) * 1000;
  
		// Calculate the total distance to move the boxes (one full rotation)
		const totalDistance = door.clientHeight * items.length;
  
		// Set the transform property to spin the boxes
		boxes.style.transition = "transform 0s"; // Disable transition temporarily
		boxes.style.transform = `translateY(-${totalDistance}px)`;
  
		// Enable the transition and reset the transform after a short delay
		setTimeout(() => {
		  boxes.style.transition = `transform ${duration / 1000}s ease-in-out`;
		  boxes.style.transform = "translateY(0)";
		}, 0);
	  }
	}, 500); // Delay before playing the spinning sound
  }
  
	// Function to shuffle the items using the Fisher-Yates algorithm
	function shuffle([...arr]) {
	  let m = arr.length;
	  while (m) {
		const i = Math.floor(Math.random() * m--);
		[arr[m], arr[i]] = [arr[i], arr[m]];
	  }
	  return arr;
	}
  
	// Initiating the slot machine on page load
	init();
  })();
  