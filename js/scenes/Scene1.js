class Scene1 extends Phaser.Scene {
  constructor() {
    super('bootGame');
  }

  preload() {
    this.load.image('bg', '../assets/images/ground_bg.png');
    this.load.image('box', '../assets/images/box.png');
    this.load.image('metal', '../assets/images/metal.png');
    this.load.tilemapTiledJSON('map', '../assets/map/map.json');

    this.load.spritesheet('player', '../assets/spritesheets/john.png', {
      frameWidth: 62,
      frameHeight: 62
    });

    this.load.spritesheet('death', '../assets/spritesheets/death.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.spritesheet('bomb', '../assets/spritesheets/bomb.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('explosion', '../assets/spritesheets/explosion_1.png', {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet('explosion2', '../assets/spritesheets/explosion_4.png', {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet('power_ups', '../assets/spritesheets/collactibles.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }
  create() {
    this.scene.start('playGame');

    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 5,
      repeat: 1
    });

    this.anims.create({
      key: 'bomb_anim',
      frames: this.anims.generateFrameNumbers('bomb'),
      frameRate: 6,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: 'bomb_detonated_anim',
      frames: this.anims.generateFrameNumbers('bomb', { start: 12, end: 13 }),
      frameRate: 10,
      repeat: -1,
      hideOnComplete: false
    });

    this.anims.create({
      key: 'explosion_anim_p1',
      frames: this.anims.generateFrameNumbers('explosion', { start: 1, end: 35 }),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: false
    });

    this.anims.create({
      key: 'explosion_anim_p2',
      frames: this.anims.generateFrameNumbers('explosion', { start: 36 }),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: 'explosion2_anim',
      frames: this.anims.generateFrameNumbers('explosion2'),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'bomb_powerup_anim',
      frames: this.anims.generateFrameNumbers('power_ups', { start: 13, end: 13 }),
      frameRate: 60,
      repeat: -1,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'fire_powerup_anim',
      frames: this.anims.generateFrameNumbers('power_ups', { start: 2, end: 2 }),
      frameRate: 60,
      repeat: -1,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'kick_powerup_anim',
      frames: this.anims.generateFrameNumbers('power_ups', { start: 3, end: 3 }),
      frameRate: 60,
      repeat: -1,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'detonate_powerup_anim',
      frames: this.anims.generateFrameNumbers('power_ups', { start: 4, end: 4 }),
      frameRate: 60,
      repeat: -1,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'speed_powerup_anim',
      frames: this.anims.generateFrameNumbers('power_ups', { start: 5, end: 5 }),
      frameRate: 60,
      repeat: -1,
      hideOnComplete: true
    });

    this.anims.create({
      key: 'death_anim',
      frames: this.anims.generateFrameNumbers('death'),
      frameRate: 24,
      repeat: 0,
      hideOnComplete: false
    });
  }
}
