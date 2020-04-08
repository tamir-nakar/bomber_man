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
    this.p1_bombs = this.add.group();
    this.p2_bombs = this.add.group();
    this.p3_bombs = this.add.group();
    this.p4_bombs = this.add.group();
    this.powerUps = this.add.group();
    this.players = this.add.group();
    this.map.createStaticLayer('bg_layer', [bgTileset]);
    const top_layer = this.map.createDynamicLayer('block_layer', [
      boxTileset,
      metalTileset
    ]);
    this.top_layer = top_layer;
    top_layer.setCollisionByProperty({ collides: true });
    this.player1 = new Player(
      this,
      90,
      90,
      {
        upKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        downKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        leftKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        rightKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        bombKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        detonatorKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
      },

      ANGLES.RIGHT,
      1
    );

    this.player2 = new Player(
      this,
      870,
      155,
      {
        upKey: this.input.keyboard.addKey(38),
        downKey: this.input.keyboard.addKey(40),
        leftKey: this.input.keyboard.addKey(37),
        rightKey: this.input.keyboard.addKey(39),
        bombKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        detonatorKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
      },
      ANGLES.LEFT,
      2
    );

    this.physics.add.collider(this.players, top_layer);

    this.physics.add.collider(this.bombs, top_layer);
    this.physics.add.collider(this.bombs);
    //this.physics.add.collider(this.players);
    this.physics.add.overlap(this.powerUps, this.explosions, powerup =>
      powerup.destroy()
    );
    this.physics.add.overlap(this.bombs, this.explosions, bomb => bomb.explode());
  }

  update() {

    this.players.getChildren().forEach(p=> p? p.update(): '')
    // if (this.player1) {
    //   this.player1.update();
    // }
    // if (this.player2) {
    //   this.player2.update();
    // }
  }
}
