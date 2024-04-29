// The player class was written in ES2019 private class pattern
// So it can be extended by AIplayer class without affecting
// The semi private classes (e.g _checkDetonator) that were written
// Outside the class scope and can be overriden by any class.

class Player extends Phaser.GameObjects.Sprite {
  // private members--!

  #id;
  #speed = 200; // protected
  #currentAvailableBombs = 1; // protected
  #numBombs = 1;
  #speedCount = 1;
  #keyboard;
  #firePower = 1; // protected
  #isDetonator = false; // protected
  #color;
  #isKicker = false;
  #isDead = false;

  constructor(scene, x, y, keyboard, start_angle, id, color) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.players.add(this);
    scene.physics.world.enableBody(this);
    this.#isDead = false;
    this.body.setSize(45, 45);
    this.body.offset.x = 10;
    this.body.offset.y = 7;
    this.scene = scene;
    this.#id = id;
    this.angle = start_angle;
    this.#color = color;
    this.#keyboard = this.#createKeyboard(keyboard);

    this.scene.physics.add.overlap(this, this.scene.explosions, () => {
      if (this && !this.#isDead) {
        this.scene.add.sprite(this.x, this.y, 'tomb').play('death_anim');
        this.#isDead = true;
        this.#updateStats();
        this.destroy();
      }
    });
  }

  get id() {
    return this.#id;
  }

  get isKicker() {
    return this.#isKicker;
  }

  get isDead() {
    return this.#isDead;
  }

  get speed() {
    return this.#speed; // for dervied
  }

  get currentAvailableBombs() {
    return this.#currentAvailableBombs;
  }

  set currentAvailableBombs(val) {
    this.#currentAvailableBombs = val;
  }

  get firePower() {
    return this.#firePower;
  }
  get isDetonator() {
    return this.#isDetonator;
  }
  create() {}

  update() {
    if (this) {
      this.#checkMovement();
      this.#checkBombPlant();
      this.#checkDetonator();
    }
  }

  isSpecificBombOverlap(bomb) {
    if (Math.abs(bomb.x - this.x) < 1 && Math.abs(bomb.y - this.y) < 1) {
      return true;
    } else return false;
  }

  increaseNumBombs() {
    this.#numBombs++;
    this.#currentAvailableBombs++;
    this.#updateStats();
  }
  increaseFirePower() {
    this.#firePower++;
    this.#updateStats();
  }
  increaseSpeed() {
    this.#speed += 50;
    this.#speedCount++;
    this.#updateStats();
  }
  turnOnDetonator() {
    this.#isDetonator = true;
    this.#updateStats();
  }
  turnOnKicker() {
    this.#isKicker = true;
    this.#updateStats();
  }

  // private Methods -- !

  #checkMovement = () => {
    if (this.body) {
      this.body.setVelocityX(0);
      this.body.setVelocityY(0);
      this.anims.play(`player${this.#id}_walk`, true);

      if (this.#keyboard.rightKey.isDown) {
        this.body.setVelocityX(this.#speed);
        this.angle = ANGLES.RIGHT;
      } else if (this.#keyboard.leftKey.isDown) {
        this.body.setVelocityX(-this.#speed);
        this.angle = ANGLES.LEFT;
      } else if (this.#keyboard.downKey.isDown) {
        this.body.setVelocityY(this.#speed);
        this.angle = ANGLES.DOWN;
      } else if (this.#keyboard.upKey.isDown) {
        this.body.setVelocityY(-this.#speed);
        this.angle = ANGLES.UP;
      } else {
        this.anims.stop();
      }
    }
  };

  #checkBombPlant = () => {
    if (this.scene) {
      if (this.#keyboard.bombKey.isDown) {
        if (this.scene.isMobile || this.#keyboard.bombKey.getDuration() > 50) {
          if (this.#currentAvailableBombs >= 1 && !this.isBombOverlap()) {
            this.#keyboard.bombKey.isDown = false;
            const addBomb = () => this.#currentAvailableBombs++;
            this.#currentAvailableBombs--;
            new Bomb(
              this.scene,
              this.x,
              this.y,
              addBomb,
              this.#firePower,
              this.#isDetonator,
              this.#id
            );
          }
        }
      }
    }
  };

  #checkDetonator = () => {
    if (this.#isDetonator) {
      if (this.#keyboard.detonatorKey.isDown) {
        if (this.scene) {
          this.scene[`p${this.#id}_bombs`].getChildren().forEach((b) => b.explode());
        }
      }
    }
  };

  isBombOverlap = () => {
    // protected
    this.scene.bombs.getChildren().find((b) => b.x - this.x < 64 || b.y - this.y < 64);

    for (let i = 0; i < this.scene.bombs.getChildren().length; i++) {
      if (
        Math.abs(this.scene.bombs.getChildren()[i].x - this.x) < 32 &&
        Math.abs(this.scene.bombs.getChildren()[i].y - this.y) < 32
      ) {
        return true;
      }
    }
  };
  #createKeyboard = (keyBoardObj) => {
    if (!this.scene.isMobile) {
      // desktop
      const res = {};
      Object.keys(keyBoardObj).forEach(
        (key) => (res[key] = this.scene.input.keyboard.addKey(keyBoardObj[key][1]))
      );

      return res;
    } else {
      return keyBoardObj;
    }
  };

  #updateStats = () => {
    const stats = {
      bombs: this.#numBombs,
      fire: this.#firePower,
      speed: this.#speedCount,
      detonator: this.#isDetonator,
      kicker: this.#isKicker,
      isDead: this.#isDead,
    };
    this.scene.updateStats(this.#id, stats);
  };
}
