class BoardManager {
  constructor(scene) {
    //super(scene, x, y, 'BoardManager');
    //scene.add.existing(this);
    this.scene = scene;
    this.board = [
      ['m', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm'],
      ['m', '', '', '', 'm', 'b', 'b', 'b', 'm', 'm', 'b', 'b', 'm', 'b', 'm'],
      ['m', '', 'm', 'b', 'b', 'b', 'm', 'b', 'm', 'b', 'm', '', '', '', 'm'],
      ['m', '', 'b', 'b', 'm', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'm', '', 'm'],
      ['m', 'b', 'm', 'b', 'b', 'b', 'm', '', 'm', 'b', 'm', 'b', 'b', 'b', 'm'],
      ['m', 'b', 'b', '', 'm', 'b', 'b', 'b', '', 'b', 'b', 'b', 'm', 'b', 'm'],
      ['m', 'b', 'm', 'b', 'b', 'b', 'm', 'b', 'm', 'b', 'm', 'b', 'b', 'b', 'm'],
      ['m', '', 'b', 'b', 'm', 'b', 'b', 'b', 'm', 'b', 'b', 'b', 'm', '', 'm'],
      ['m', '', '', '', 'b', 'b', 'm', 'b', 'b', 'b', 'm', '', '', '', 'm'],
      ['m', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm']
    ];
  }

  initBoard() {
    let x = 30;
    let y = 30;

    this.scene.tiles = this.scene.physics.add.staticGroup({
      key: 'block',
      immovable: true
    });

    //this.scene.tiles.enableBody = true;
    this.board.forEach(row => {
      row.forEach(tile => {
        if (tile === TILES.METAL) {
          this.scene.tiles.create(x, y, 'metal').setSize(62, 62, true);
        } else if (tile === TILES.BOX) {
          this.scene.tiles.create(x, y, 'box').setSize(62, 62, true);
        } else if (tile === TILES.EMPTY) {
          // this.scene.empty.add(new Phaser.Geom.Rectangle(x, y, 64, 64));
        }
        x += 64;
      });
      x = 30;
      y += 64;
    });

    this.scene.tiles.refresh();
  }

  getTileByCoordinate(x, y) {
    //console.log(`(${Math.floor((x - 30) / 64)},${Math.floor((y - 30) / 64)})`);
  }
  update() {}
}

// private -- !
