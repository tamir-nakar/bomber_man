class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
  }

  create() {
    this.map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    const metalTileset = this.map.addTilesetImage('metal');
    const boxTileset = this.map.addTilesetImage('box');
    const bgTileset = this.map.addTilesetImage('ground_bg', 'bg');
    this.explosions = this.add.group();
    this.bombs = this.add.group();
    this.powerUps = this.add.group();
    this.map.createStaticLayer('bg_layer', [bgTileset]);
    const top_layer = this.map.createDynamicLayer('block_layer', [
      boxTileset,
      metalTileset
    ]);
    this.top_layer = top_layer;
    top_layer.setCollisionByProperty({ collides: true });
    this.player = new Player(
      this,
      90,
      90,
      this.input.keyboard.createCursorKeys(),
      ANGLES.RIGHT
    );

    this.physics.add.collider(this.player, top_layer);

    this.physics.add.collider(this.bombs, top_layer);
    this.physics.add.collider(this.bombs);
    this.physics.add.overlap(this.powerUps, this.explosions, powerup =>
      powerup.destroy()
    );
    this.physics.add.overlap(this.bombs, this.explosions, bomb => bomb.explode());
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}
