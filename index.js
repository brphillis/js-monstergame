const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 108) {
  collisionsMap.push(collisions.slice(i, 108 + i));
}

const battlezonesMap = [];
for (let i = 0; i < battlezonesData.length; i += 108) {
  battlezonesMap.push(battlezonesData.slice(i, 108 + i));
}

const boundaries = [];

const offset = {
  x: -1175,
  y: -1820,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 16875)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battlezones = [];

battlezonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 16875)
      battlezones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

console.log(battlezones);

const image = new Image();
image.src = "./map-assets/hometown.png";

const foregroundImage = new Image();
foregroundImage.src = "./map-assets/homeTownForeground.png";

const playerDownImage = new Image();
playerDownImage.src = "./character-assets/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./character-assets/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./character-assets/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./character-assets/playerRight.png";

// canvas.width / 2 - this.image.width / 4 / 13,
// canvas.height / 2 - this.image.height / 2,

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 13,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const moveables = [background, ...boundaries, foreground, ...battlezones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiated: false,
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battlezones.forEach((battlezone) => {
    battlezone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;
  //ACTIVATES A BATTLE
  if (keys.a.pressed || keys.d.pressed || keys.w.pressed || keys.s.pressed) {
    for (let i = 0; i < battlezones.length; i++) {
      const battlezone = battlezones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battlezone.position.x + battlezone.width
        ) -
          Math.max(player.position.x, battlezone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battlezone.position.y + battlezone.height
        ) -
          Math.max(player.position.y, battlezone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battlezone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        //DEACTIVATE CURRENT ANIMATION LOOP
        window.cancelAnimationFrame(animationId);
        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();
        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle();
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });

            //ACTIVATE NEW ANIMATION LOOP
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x += 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x -= 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y -= 3;
      });
  }
}
// animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

let clicked = false;
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});
