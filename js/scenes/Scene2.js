class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
  }

  create() {
    var map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    const metalTileset = map.addTilesetImage('metal');
    const boxTileset = map.addTilesetImage('box');
    const bgTileset = map.addTilesetImage('ground_bg', 'bg');

    const bottom_layer = map.createStaticLayer('bg_layer', [bgTileset]);
    const top_layer = map.createStaticLayer('block_layer', [boxTileset, metalTileset]);

    top_layer.setCollisionByProperty({ collides: true });
    this.player = new Player(
      this,
      90,
      90,
      this.input.keyboard.createCursorKeys(),
      ANGLES.RIGHT
    );
    this.physics.add.collider(this.player, top_layer);
  }

  update() {
    this.player.update();
  }
}
