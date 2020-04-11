class Bomb extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, onBombExplodedHandler, firePower, isDetonated, id) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this, true);
    this.id = id;

    isDetonated
      ? this.anims.play('bomb_detonated_anim')
      : this.anims.play(`bomb${this.id}_anim`);

    //this.anims.chain('explosion_anim');

    scene.physics.world.enableBody(this);

    this.body.moves = false;
    this.body.immovable = true;
    if (this.scene.playersRefs[this.id - 1].isKicker) {
      this.body.moves = true;
      this.body.immovable = false;
    }

    scene.physics.add.collider(this, scene.players, (_, player) => {
      player.isKicker //&& !player.isSpecificBombOverlap
        ? (this.body.moves = true)
        : (this.body.moves = false);
      player.isKicker //&& !player.isSpecificBombOverlap
        ? (this.body.immovable = false)
        : (this.body.immovable = true);
    });
    this.scene.bombs.add(this);
    this.scene[`p${this.id}_bombs`].add(this);

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
