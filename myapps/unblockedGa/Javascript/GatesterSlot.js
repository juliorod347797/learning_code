(function () {
  const items = [
      '🍭',
      '❌',
      '⛄️',
      '🦄',
      '🍌',
      '💩',
      '👻',
      '😻',
      '💵',
      '🤡',
      '🦖',
      '🍎',
      '😂',
      '🖕',
  ];
  const doors = document.querySelectorAll('.door');
  const coinSound = new Audio("../music/coininsert.mp3");
  const spinSound = new Audio("../music/wheelspinslot.mp3");

  document.querySelector('#spinner').addEventListener('click', spin);
  document.querySelector('#reseter').addEventListener('click', init);

  function init(firstInit = true, groups = 1, duration = 1) {
      for (const door of doors) {
          if (firstInit) {
              door.dataset.spinned = '0';
          } else if (door.dataset.spinned === '1') {
              const boxes = door.querySelector('.boxes');
              slowDownAnimation(boxes, duration);
              return;
          }

          const boxes = door.querySelector('.boxes');
          const boxesClone = boxes.cloneNode(false);
          const pool = ['❓'];

          if (!firstInit) {
              const arr = [];
              for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                  arr.push(...items);
              }
              pool.push(...shuffle(arr));

              boxesClone.addEventListener(
                  'transitionstart',
                  function () {
                      door.dataset.spinned = '1';
                      this.querySelectorAll('.box').forEach((box) => {
                          box.style.filter = 'blur(1px)';
                      });
                  },
                  { once: true }
              );

              boxesClone.addEventListener(
                  'transitionend',
                  function () {
                      this.querySelectorAll('.box').forEach((box, index) => {
                          box.style.filter = 'blur(0)';
                          if (index > 0) this.removeChild(box);
                      });
                  },
                  { once: true }
              );
          }

          for (let i = pool.length - 1; i >= 0; i--) {
              const box = document.createElement('div');
              box.classList.add('box');
              box.style.width = door.clientWidth + 'px';
              box.style.height = door.clientHeight + 'px';
              box.textContent = pool[i];
              boxesClone.appendChild(box);
          }
          boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
          boxesClone.style.transitionTimingFunction = 'cubic-bezier(0.5, 0, 0.5, 1)';
          boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
          door.replaceChild(boxesClone, boxes);
      }
  }

  function slowDownAnimation(element, duration) {
      element.style.transition = `transform ${duration}s ease-in-out`;
      element.style.transform = 'translateY(0)';
  }

  function spin() {
      coinSound.play();
      init(false, 1, 2);

      setTimeout(() => {
          spinSound.play();

          for (const door of doors) {
              const boxes = door.querySelector('.boxes');
              const duration = parseInt(boxes.style.transitionDuration);
              boxes.style.transform = 'translateY(0)';
              new Promise((resolve) => setTimeout(resolve, duration * 100));
          }
      }, 500);
  }

  function shuffle([...arr]) {
      let m = arr.length;
      while (m) {
          const i = Math.floor(Math.random() * m--);
          [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
  }

  init();

})();




