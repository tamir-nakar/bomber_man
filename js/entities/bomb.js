class Bomb extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, onBombExplodedHandler) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this, true);

    this.play('bomb_anim');

    scene.physics.world.enableBody(this);
    this.body.immovable = true;
    this.body.moves = false;
    scene.physics.add.collider(this, scene.player);

    this.on(
      'animationcomplete',
      () => {
        onBombExplodedHandler;
      },
      this
    );
  }

  update() {
    _checkMovement.call(this);
    _checkBombPlant.call(this);
  }
}

// private -- !
