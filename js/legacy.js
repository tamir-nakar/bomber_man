this.ship1.setScale(2);
this.ship1.flipY = true;

this.ship1.play("ship1_anim");
this.ship2.play("ship2_anim");
this.ship3.play("ship3_anim");

this.ship1.setInteractive();
this.ship2.setInteractive();
this.ship3.setInteractive();

this.input.on("gameobjectdown", this.destroyShip, this);

this.player = this.physics.add.sprite(
  config.width / 2 - 8,
  config.height - 64,
  "player"
);
this.player.play("thrust");
this.cursorKeys = this.input.keyboard.createCursorKeys();
this.player.setCollideWorldBounds(true);
this.spacebar = this.input.keyboard.addKey(
  Phaser.Input.Keyboard.KeyCodes.SPACE
);

this.projectiles = this.add.group();
}

update() {
this.moveShip(this.ship1, 1);
this.moveShip(this.ship2, 2);
this.moveShip(this.ship3, 3);
//this.background.tilePositionY -= 0.5;
this.movePlayerManager();
if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
  if (this.player.active) {
    this.shootBeam();
  }
}

for (let i = 0; i < this.projectiles.getChildren().length; i++) {
  const beam = this.projectiles.getChildren()[i];
  beam.update();
}
}
moveShip(ship, speed) {
ship.y += speed;
if (ship.y > config.height) {
  this.resetShipPos(ship);
}
}

shootBeam() {
const beam = new Beam(this);
}

resetShipPos(ship) {
ship.y = 0;
var randomX = Phaser.Math.Between(0, config.width);
ship.x = randomX;
}

destroyShip(pointer, gameObject) {
gameObject.setTexture("explosion");
gameObject.play("explode");
}


pickPowerUp(player, powerUp) {
powerUp.disableBody(true, true);
}

hitEnemy(projectile, enemy) {
const explosion = new Explosion(this, enemy.x, enemy.y);
projectile.destroy();
//enemy.setTexture("explosion");
//enemy.play("explode");
this.resetShipPos(enemy);
}

hurtPlayer(player, enemy) {
this.resetShipPos(enemy);
const explosion = new Explosion(this, player.x, player.y);
player.disableBody(true, true);
player.x = config.width / 2 - 8;
player.y = config.height - 64;

this.time.addEvent({
  delay: 1000,
  callback: this.resetPlayer,
  callbackScope: this,
  loop: false
});
}
this.ship1 = this.add.sprite(
    config.width / 2 - 50,
    config.height / 2,
    "ship1"
  );
  this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
  this.ship3 = this.add.sprite(
    config.width / 2 + 50,
    config.height / 2,
    "ship3"
  );

  this.powerUps = this.physics.add.group();

  const maxObjects = 4;
  for (let i = 0; i < maxObjects; i++) {
    const powerUp = this.physics.add.sprite(16, 16, "power-up");
    this.powerUps.add(powerUp);
    powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

    if (Math.random() > 0.5) {
      powerUp.play("red");
    } else {
      powerUp.play("grey");
    }

    powerUp.setVelocity(100, 100);
    powerUp.setCollideWorldBounds(true);
    powerUp.setBounce(1);
  }

  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("explosion"),
    frameRate: 20,
    repeat: 0,
    hideOnComplete: true
  });
resetPlayer() {
const x = config.width / 2 - 8;
const y = config.height + 64;
this.player.enableBody(true, x, y, true, true);
}
/////////////////////////////////////////////////////////////

    //this.load.image("ship1", "../assets/images/ship1.png");
    //this.load.image("ship2", "../assets/images/ship2.png");
    //this.load.image("ship3", "../assets/images/ship3.png");
    this.load.spritesheet('ship1', '../assets/spritesheets/ship1.png', {
      frameWidth: 16,
      frameHeight: 16
    });

        this.load.spritesheet('explosion', '../assets/spritesheets/explosion.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('power-up', '../assets/spritesheets/power-up.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet('player', '../assets/spritesheets/player.png', {
      frameWidth: 16,
      frameHeight: 24
    });
    this.load.spritesheet('beam', '../assets/spritesheets/beam.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.add.text(20, 20, 'Loading Game...');


    this.anims.create({
      key: 'red',
      frames: this.anims.generateFrameNumbers('power-up', { start: 0, end: 1 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'grey',
      frames: this.anims.generateFrameNumbers('power-up', { start: 2, end: 3 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'thrust',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'beam_anim',
      frames: this.anims.generateFrameNumbers('beam'),
      frameRate: 20,
      repeat: -1
    });


    this.anims.create({
      key: 'ship1_anim',
      frames: this.anims.generateFrameNumbers('ship1'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'ship2_anim',
      frames: this.anims.generateFrameNumbers('ship2'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'ship3_anim',
      frames: this.anims.generateFrameNumbers('ship3'),
      frameRate: 20,
      repeat: -1
    });
