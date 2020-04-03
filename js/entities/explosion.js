class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, size) {
    super(scene, x, y, 'explosion');
    scene.add.existing(this, true); // static
    this.subExplosions = [];
    this.subExplosionsCount = null;
    this.scene = scene;
    this.size = size;
    this.scene.physics.world.enableBody(this);
    this.body.moves = false;
    this.body.setSize(64, 64);
    this.isShake = true;
    this.scene.explosions.add(this);
    _setSubExplosions.call(this);
    _playExplosionAnims.call(this);

    this.subExplosions.forEach(sub_e => {
      sub_e.on('animationcomplete', () => {
        if (sub_e.anims.currentAnim.key === 'explosion_anim_p1') {
          // animation phase 1
          sub_e.body.setEnable(false);
          const tile = this.scene.map.getTileAt(
            scene.map.worldToTileX(sub_e.x),
            scene.map.worldToTileY(sub_e.y)
          );
          this.body.setEnable(false);
          if (tile) {
            this.scene.map.removeTile(tile);

            if (Math.floor(Math.random() * 100 + 1) > 70)
              new PowerUp(this.scene, sub_e.x, sub_e.y);
          }

          sub_e.play('explosion_anim_p2');
        } else {
          // animation phase 2

          this.subExplosionsCount--;
          sub_e.destroy();
        }
        if (this.subExplosionsCount <= 0) {
          this.destroy();
        }
      });
    });
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

function _setSubExplosions() {
  const arr = _getTilesToExplode.call(this);
  this.subExplosionsCount = arr.length;
  arr.forEach(tile => {
    const sprite = this.scene.add.sprite(tile[0], tile[1], 'explosion');
    sprite.setDepth(1);
    sprite.setSize(64, 64);
    this.scene.explosions.add(sprite);

    this.scene.physics.world.enableBody(sprite);
    sprite.body.offset.x = 95;
    sprite.body.offset.y = 95;
    sprite.body.moves = false;

    this.subExplosions.push(sprite);
  });
}

function _playExplosionAnims() {
  if (this.isShake) {
    this.isShake = false;
    this.scene.cameras.main.shake(200, 0.009);
  }
  this.size >= 3
    ? this.play('middle_explosion_big')
    : this.play('middle_explosion_small');

  this.subExplosions.forEach(ex => {
    ex.anims.play('explosion_anim_p1');
  });
}
