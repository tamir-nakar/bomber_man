class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, keyboard, start_angle) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.angle = start_angle;
    this.speed = 200;
    this.currentAvailableBombs = 1;
    this.keyboard = keyboard;
  }

  update() {
    _checkMovement.call(this);
    _checkBombPlant.call(this);
  }
}

// private -- !

function _checkMovement() {
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
  if (this.keyboard.space.isDown && this.keyboard.space.getDuration() > 50) {
    if (this.currentAvailableBombs >= 1) {
      this.keyboard.space.isDown = false;
      const addBomb = () => this.currentAvailableBombs++;
      this.currentAvailableBombs--;
      new Bomb(this.scene, this.x, this.y, addBomb);
    }
  }
}
