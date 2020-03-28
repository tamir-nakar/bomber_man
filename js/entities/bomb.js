class Bomb extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, onBombExplodedHandler, firePower, isDetonated) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this, true);

    isDetonated ? this.anims.play('bomb_detonated_anim') : this.anims.play('bomb_anim');

    //this.anims.chain('explosion_anim');

    scene.physics.world.enableBody(this);

    this.scene.player.isKicker ? (this.body.moves = true) : (this.body.moves = false);
    this.scene.player.isKicker
      ? (this.body.immovable = false)
      : (this.body.immovable = true);

    scene.physics.add.collider(this, scene.player);
    this.scene.bombs.add(this);

    this.on(
      'animationcomplete',
      () => {
        onBombExplodedHandler();
        new Explosion(scene, this.x, this.y, firePower);
        this.destroy();
      },
      this
    );
  }

  explode() {
    this.anims.stop();
  }

  update() {
    _checkMovement.call(this);
    _checkBombPlant.call(this);
  }
}

// private -- !
