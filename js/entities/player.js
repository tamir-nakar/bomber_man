class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, keyboard, start_angle) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.angle = start_angle;
    this.speed = 200;
    this.currentAvailableBombs = 1;
    this.keyboard = keyboard;
    this.firePower = 1;
    this.body.setSize(50, 50);
    this.isDetonator = false;
    this.isKicker = false;
    this.isDead = false;
    scene.physics.add.overlap(this, scene.explosions, (_, exp) => {
      if (this && !this.isDead) {
        console.log(Phaser.Animations);
        console.log(exp);
        console.log(exp.animations);
        scene.add.sprite(this.x, this.y, 'tomb').play('death_anim');
        this.isDead = true;
        this.destroy();
      }
      //this.destroy();
    });
  }

  update() {
    if (this) {
      _checkMovement.call(this);
      _checkBombPlant.call(this);
      _checkDetonator.call(this);
    }
  }

  increaseNumBombs() {
    this.currentAvailableBombs++;
  }
  increaseFirePower() {
    this.firePower++;
  }
  increaseSpeed() {
    this.speed += 50;
    console.log('speed up');
  }
  turnOnDetonator() {
    console.log('detonator');
    this.isDetonator = true;
    //this.isKicker = false;
  }
  turnOnKicker() {
    console.log('kicker');
    this.isKicker = true;
    //this.isDetonator = false;
  }
}

// private -- !

function _checkMovement() {
  if (!this.body) return;
  this.body.setVelocityX(0);
  this.body.setVelocityY(0);
  this.anims.play('player_walk', true);

  if (this.keyboard.right.isDown) {
    this.body.setVelocityX(this.speed);
    this.angle = ANGLES.RIGHT;
  } else if (this.keyboard.left.isDown) {
    this.body.setVelocityX(-this.speed);
    this.angle = ANGLES.LEFT;
  } else if (this.keyboard.down.isDown) {
    this.body.setVelocityY(+this.speed);
    this.angle = ANGLES.DOWN;
  } else if (this.keyboard.up.isDown) {
    this.body.setVelocityY(-this.speed);
    this.angle = ANGLES.UP;
  } else {
    this.anims.stop();
  }
}

function _checkBombPlant() {
  if (!this.scene) return;
  if (this.keyboard.space.isDown && this.keyboard.space.getDuration() > 50) {
    if (this.currentAvailableBombs >= 1) {
      this.keyboard.space.isDown = false;
      const addBomb = () => this.currentAvailableBombs++;
      this.currentAvailableBombs--;
      new Bomb(this.scene, this.x, this.y, addBomb, this.firePower, this.isDetonator);
    }
  }
}

function _checkDetonator() {
  if (this.isDetonator) {
    if (this.keyboard.shift.isDown) {
      if (this.scene) {
        this.scene.bombs.getChildren().forEach(b => b.explode());
      }
    }
  }
}
