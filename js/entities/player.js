class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, keyboard, start_angle) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    this.play('player_anim');
    scene.physics.world.enableBody(this);
    this.angle = start_angle;
    this.speed = 3;
    this.body.setCollideWorldBounds(true);
    this.currentAvailableBombs = 1;

    this.isBlocked = false;
    this.keyboard = keyboard;

    scene.physics.add.overlap(
      this,
      scene.tiles,
      function(a, b) {
        this.isBlocked = true;
      },
      null,
      this
    );
  }

  update() {
    _checkMovement.call(this);
    _checkBombPlant.call(this);
    this.scene.boardManager.getTileByCoordinate(this.x, this.y);
    //console.log(this.body.touched.up);
    if (this.y < 30) {
      this.destroy();
    }
  }
}

// private -- !

function _checkMovement() {
  if (this.keyboard.right.isDown) {
    if (!this.isBlocked || (this.isBlocked && this.angle !== ANGLES.RIGHT)) {
      this.x += this.speed;
      this.isBlocked = false;
    }
    this.angle = ANGLES.RIGHT;
  } else if (this.keyboard.left.isDown) {
    if (!this.isBlocked || (this.isBlocked && this.angle !== ANGLES.LEFT)) {
      this.x -= this.speed;
      this.isBlocked = false;
    }
    this.angle = ANGLES.LEFT;
  } else if (this.keyboard.down.isDown) {
    if (!this.isBlocked || (this.isBlocked && this.angle !== ANGLES.DOWN)) {
      this.y += this.speed;
      this.isBlocked = false;
    }
    this.angle = ANGLES.DOWN;
  } else if (this.keyboard.up.isDown) {
    if (!this.isBlocked || (this.isBlocked && this.angle !== ANGLES.UP)) {
      this.y -= this.speed;
      this.isBlocked = false;
    }
    this.angle = ANGLES.UP;
  } else {
    //this.anims.stop();
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
