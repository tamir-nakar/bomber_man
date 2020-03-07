class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, size) {
    super(scene, x, y, 'explosion');
    scene.add.existing(this, true); // static
    this.subExplosions = [];
    this.scene = scene;
    this.size = size;
    // this.scene.explosions = this.scene.physics.add.staticGroup({
    //   key: 'explosions',
    //   immovable: true
    // });

    const arr = _getTilesToExplode.call(this);
    arr.forEach(tile =>
      this.subExplosions.push(scene.add.sprite(tile[0], tile[1], 'explosion'))
    );

    this.play('explosion2_anim');

    this.subExplosions.forEach(ex => ex.play('explosion_anim'));
    // this.subExplosions.forEach(ex => this.scene.add.existing(ex, true));
    // scene.physics.world.enableBody(this.scene.explosions);
    // this.scene.physics.add.overlap(this.scene.explosions, this.scene.top_layer, () =>
    //   console.log('ha!')
    // );
    this.on(
      'animationcomplete',
      () => {
        this.subExplosions.forEach(ex => {
          const tile = scene.map.getTileAt(
            scene.map.worldToTileX(ex.x),
            scene.map.worldToTileY(ex.y)
          );
          if (tile) scene.map.removeTile(tile);
          ex.destroy();
        });
        this.destroy();
      },
      this
    );

    scene.physics.world.enableBody(this);
    this.body.immovable = true;
    this.body.moves = false;
    //scene.physics.add.collider(this, scene.player);
  }
}

// private --!

function _getTilesToExplode() {
  let tilesToExplode = [];

  for (let i = 1; i <= this.size; i++) {
    let left = [this.x + CONSTS.UNIT_SIZE * i, this.y];
    let right = [this.x, this.y + CONSTS.UNIT_SIZE * i];
    let top = [this.x - CONSTS.UNIT_SIZE * i, this.y];
    let bottom = [this.x, this.y - CONSTS.UNIT_SIZE * i];
    let candidates = [left, right, top, bottom];

    tilesToExplode = [
      ...tilesToExplode,
      ...candidates.filter(cand =>
        _isTileExplodable.call(
          this,
          this.scene.map.getTileAt(
            this.scene.map.worldToTileX(cand[0]),
            this.scene.map.worldToTileY(cand[1])
          )
        )
      )
    ];
    candidates = [];
  }
  return tilesToExplode;
}

function _isTileExplodable(tile) {
  return !tile || tile.index === 2;
}
