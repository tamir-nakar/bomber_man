class Scene1 extends Phaser.Scene {
  constructor() {
    super('bootGame');
  }

  preload() {
    this.load.image('bg', '../assets/images/ground_bg.png');
    this.load.image('box', '../assets/images/box.png');
    this.load.image('metal', '../assets/images/metal.png');

    this.load.spritesheet('player', '../assets/spritesheets/john.png', {
      frameWidth: 62,
      frameHeight: 62
    });

    this.load.spritesheet('bomb', '../assets/spritesheets/bomb.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }
  create() {
    this.scene.start('playGame');

    this.anims.create({
      key: 'player_anim',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'bomb_anim',
      frames: this.anims.generateFrameNumbers('bomb'),
      frameRate: 3,
      repeat: 0,
      hideOnComplete: true
    });
  }
}
