class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
  }

  draw() {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    attacks,
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }

  faint() {
    document.querySelector("#dialogBox").innerHTML = this.name + " fainted! ";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
    audio.victory.play();
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogBox").style.display = "block";
    document.querySelector("#dialogBox").innerHTML =
      this.name + " used " + attack.name + " for " + attack.damage + " damage ";
    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";
    let rotation = 1;
    if (this.isEnemy) rotation = -2.5;

    recipient.health -= attack.damage;

    switch (attack.name) {
      case "Superbark":
        audio.initSuperbark.play();
        const superbarkImage = new Image();
        superbarkImage.src = "./battle-assets/superwoof.png";
        const Superbark = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: superbarkImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, Superbark);

        gsap.to(Superbark.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            audio.superbarkHit.play();
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 3,
              duration: 0.09,
            });
            //Flashing when hit, turned off
            // gsap.to(recipient, {
            //   opacity: 0,
            //   repeat: 3,
            //   yoyo: true,
            //   duration: 0.09,
            // });
            renderedSprites.splice(1, 1);
          },
        });
        break;

      case "Fireball":
        audio.initSuperbark.play();
        const fireballImage = new Image();
        fireballImage.src = "./battle-assets/fireball.png";
        const Fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, Fireball);

        gsap.to(Fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            audio.superbarkHit.play();
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 3,
              duration: 0.09,
            });
            //Flashing when hit, turned off
            // gsap.to(recipient, {
            //   opacity: 0,
            //   repeat: 3,
            //   yoyo: true,
            //   duration: 0.09,
            // });
            renderedSprites.splice(1, 1);
          },
        });
        break;

      case "Tackle":
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
          x: this.position.x - movementDistance,
          y: this.position.y + movementDistance / 2,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            y: this.position.y - movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              //Enemy HIT
              audio.tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 3,
                duration: 0.09,
              });
              //Flashing when hit, turned off
              // gsap.to(recipient, {
              //   opacity: 0,
              //   repeat: 3,
              //   yoyo: true,
              //   duration: 0.09,
              // });
            },
          })
          .to(this.position, {
            x: this.position.x,
            y: this.position.y,
          });
    }
  }
  break;
}

class Boundary {
  static width = 56;
  static height = 56;
  constructor({ position }) {
    this.position = position;
    this.width = 56;
    this.height = 56;
  }

  draw() {
    c.fillStyle = "rgba(255,0,0,0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
