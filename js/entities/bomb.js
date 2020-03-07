class Bomb extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, onBombExplodedHandler, firePower) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this, true);

    this.anims.play('bomb_anim');
    //this.anims.chain('explosion_anim');

    scene.physics.world.enableBody(this);
    this.body.immovable = true;
    this.body.moves = false;
    scene.physics.add.collider(this, scene.player);

    this.on(
      'animationcomplete',
      () => {
        onBombExplodedHandler();
        new Explosion(scene, this.x, this.y, 1);
        this.destroy();
      },
      this
    );
    //   this.on(
    //     'animationcomplete',
    //     function() {
    //       console.log(
    //         scene.map.getTileAt(
    //           scene.map.worldToTileX(this.x + 64),
    //           scene.map.worldToTileY(this.y)
    //         )
    //       );
    //       scene.map.removeTile(
    //         scene.map.getTileAt(
    //           scene.map.worldToTileX(this.x + 64),
    //           scene.map.worldToTileY(this.y)
    //         )
    //       );
    //     },
    //     this
    //   );
  }

  update() {
    _checkMovement.call(this);
    _checkBombPlant.call(this);
  }
}

// private -- !
