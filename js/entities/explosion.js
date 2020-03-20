class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, size) {
    super(scene, x, y, 'explosion');
    scene.add.existing(this, true); // static
    this.subExplosions = [];
    this.scene = scene;
    this.size = size;

    const arr = _getTilesToExplode.call(this);
    arr.forEach(tile => {
      const sprite = scene.add.sprite(tile[0], tile[1], 'explosion');
      sprite.setSize(64, 64);
      this.scene.explosions.add(sprite);

      this.scene.physics.world.enableBody(sprite);
      sprite.body.offset.x = 95;
      sprite.body.offset.y = 95;
      sprite.body.moves = false;

      this.subExplosions.push(sprite);
    });

    this.play('explosion2_anim');

    this.subExplosions.forEach(ex => {
      ex.play('explosion_anim');
    });

    this.on(
      'animationcomplete',
      () => {
        this.subExplosions.forEach(ex => {
          const tile = scene.map.getTileAt(
            scene.map.worldToTileX(ex.x),
            scene.map.worldToTileY(ex.y)
          );
          if (tile) {
            scene.map.removeTile(tile);
            if (Math.floor(Math.random() * 100 + 1) > 70)
              new PowerUp(this.scene, ex.x, ex.y);
          }
          ex.destroy();
        });
        this.destroy();
      },
      this
    );

    scene.physics.world.enableBody(this);

    this.body.moves = false;
    this.body.setSize(1, 1);
    //scene.physics.add.collider(this, scene.player);
  }
}

// private --!

function _getTilesToExplode() {
  let tilesToExplode = [];
  let blockers = {
    right: false,
    left: false,
    top: false,
    bottom: false
  };

  for (let i = 1; i <= this.size; i++) {
    let rightCoords = [this.x + CONSTS.UNIT_SIZE * i, this.y];
    let bottomCoords = [this.x, this.y + CONSTS.UNIT_SIZE * i];
    let leftCoords = [this.x - CONSTS.UNIT_SIZE * i, this.y];
    let topCoords = [this.x, this.y - CONSTS.UNIT_SIZE * i];
    let candidates = [
      { dir: 'left', coords: leftCoords },
      { dir: 'right', coords: rightCoords },
      { dir: 'top', coords: topCoords },
      { dir: 'bottom', coords: bottomCoords }
    ];

    tilesToExplode = [
      ...tilesToExplode,
      ...candidates
        .filter(cand => !blockers[cand.dir])
        .filter(cand =>
          _isTileExplodable.call(
            this,
            this.scene.map.getTileAt(
              this.scene.map.worldToTileX(cand.coords[0]),
              this.scene.map.worldToTileY(cand.coords[1])
            ),
            blockers,
            cand.dir
          )
        )
    ];

    candidates = [];
  }
  return tilesToExplode.map(key => key.coords);
}

function _isTileExplodable(tile, blockersArr, blockersKey) {
  if (tile && (tile.index === 2 || tile.index === 1)) {
    blockersArr[blockersKey] = true;
  }
  return !tile || tile.index === 2;
}
