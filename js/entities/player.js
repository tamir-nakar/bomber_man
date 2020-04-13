class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, keyboard, start_angle, id, color) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.players.add(this);
    scene.physics.world.enableBody(this);
    this.id = id;
    this.angle = start_angle;
    this.speed = 200;
    this.currentAvailableBombs = 1;
    this.numBombs = 1;
    this.color = color;

    this.keyboard = _createKeyboard.call(scene, keyboard);
    this.firePower = 1;
    this.body.setSize(45, 45);
    this.isDetonator = false;
    this.isKicker = false;
    this.isDead = false;
    this.body.offset.x = 10;
    this.body.offset.y = 7;
    this.speedCount = 1;

    scene.physics.add.overlap(this, scene.explosions, (_, exp) => {
      if (this && !this.isDead) {
        scene.add.sprite(this.x, this.y, 'tomb').play('death_anim');
        this.isDead = true;
        _updateStats.call(this);
        this.destroy();
      }
      //this.destroy();
    });
  }

  isSpecificBombOverlap(bomb) {
    if (Math.abs(bomb.x - this.x) < 1 && Math.abs(bomb.y - this.y) < 1) {
      return true;
    } else return false;
  }

  update() {
    if (this) {
      _checkMovement.call(this);
      _checkBombPlant.call(this);
      _checkDetonator.call(this);
    }
  }

  increaseNumBombs() {
    this.numBombs++;
    this.currentAvailableBombs++;
    _updateStats.call(this);
  }
  increaseFirePower() {
    this.firePower++;
    _updateStats.call(this);
  }
  increaseSpeed() {
    this.speed += 50;
    this.speedCount++;
    _updateStats.call(this);
  }
  turnOnDetonator() {
    this.isDetonator = true;
    _updateStats.call(this);
  }
  turnOnKicker() {
    this.isKicker = true;
    _updateStats.call(this);
  }
}

// private -- !

function _checkMovement() {
  if (!this.body) return;
  this.body.setVelocityX(0);
  this.body.setVelocityY(0);
  this.anims.play(`player${this.id}_walk`, true);

  if (this.keyboard.rightKey.isDown) {
    this.body.setVelocityX(this.speed);
    this.angle = ANGLES.RIGHT;
  } else if (this.keyboard.leftKey.isDown) {
    this.body.setVelocityX(-this.speed);
    this.angle = ANGLES.LEFT;
  } else if (this.keyboard.downKey.isDown) {
    this.body.setVelocityY(+this.speed);
    this.angle = ANGLES.DOWN;
  } else if (this.keyboard.upKey.isDown) {
    this.body.setVelocityY(-this.speed);
    this.angle = ANGLES.UP;
  } else {
    this.anims.stop();
  }
}

function _checkBombPlant() {
  if (!this.scene) return;
  if (this.keyboard.bombKey.isDown && this.keyboard.bombKey.getDuration() > 50) {
    if (this.currentAvailableBombs >= 1 && !_isBombOverlap.call(this)) {
      this.keyboard.bombKey.isDown = false;
      const addBomb = () => this.currentAvailableBombs++;
      this.currentAvailableBombs--;
      new Bomb(
        this.scene,
        this.x,
        this.y,
        addBomb,
        this.firePower,
        this.isDetonator,
        this.id
      );
    }
  }
}

function _checkDetonator() {
  if (this.isDetonator) {
    if (this.keyboard.detonatorKey.isDown) {
      if (this.scene) {
        this.scene[`p${this.id}_bombs`].getChildren().forEach(b => b.explode());
      }
    }
  }
}

function _isBombOverlap() {
  this.scene.bombs.getChildren().find(b => b.x - this.x < 64 || b.y - this.y < 64);

  for (let i = 0; i < this.scene.bombs.getChildren().length; i++) {
    if (
      Math.abs(this.scene.bombs.getChildren()[i].x - this.x) < 32 &&
      Math.abs(this.scene.bombs.getChildren()[i].y - this.y) < 32
    ) {
      return true;
    }
  }
}

function _createKeyboard(keyBoardObj) {
  const res = {};
  Object.keys(keyBoardObj).forEach(
    key => (res[key] = this.input.keyboard.addKey(keyBoardObj[key][1]))
  );

  return res;
}

function _updateStats() {
  const stats = {
    bombs: this.numBombs,
    fire: this.firePower,
    speed: this.speedCount,
    detonator: this.isDetonator,
    kicker: this.isKicker,
    isDead: this.isDead
  };
  this.scene.updateStats(this.id, stats);
}
