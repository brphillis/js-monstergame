const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./battle-assets/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let eyegorr;
let ralph;
let renderedSprites;
let battleAnimationId;
let queue;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogBox").style.display = "hidden";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  eyegorr = new Monster(monsters.Eyegorr);
  ralph = new Monster(monsters.Ralph);
  renderedSprites = [eyegorr, ralph];
  queue = [];

  ralph.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log(e.currentTarget.innerHTML);
      const selectedAtttack = attacks[e.currentTarget.innerHTML];
      ralph.attack({
        attack: selectedAtttack,
        recipient: eyegorr,
        renderedSprites,
      });

      if (eyegorr.health <= 0) {
        queue.push(() => {
          eyegorr.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              document.querySelector("#dialogBox").innerHTML =
                " Battle Initiated! ";

              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.Map.play();
            },
          });
        });
      }

      const randomAttack =
        eyegorr.attacks[Math.floor(Math.random() * eyegorr.attacks.length)];

      queue.push(() => {
        eyegorr.attack({
          attack: randomAttack,
          recipient: ralph,
          renderedSprites,
        });
        if (ralph.health <= 0) {
          queue.push(() => {
            ralph.faint();
          });
          queue.push(() => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#userInterface").style.display = "none";
                document.querySelector("#dialogBox").innerHTML =
                  " Battle Initiated! ";

                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.Map.play();
              },
            });
          });
        }
      });
    });

    button.addEventListener("mouseenter", (e) => {
      const selectedAtttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML =
        selectedAtttack.type + " type";
      document.querySelector("#attackType").style.color = selectedAtttack.color;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animate();
// initBattle();
// animateBattle();

document.querySelector("#dialogBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
