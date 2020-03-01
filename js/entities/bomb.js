class Bomb extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, onBombExplodedHandler) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this);
    this.play('bomb_anim');
    scene.physics.world.enableBody(this);
    this.on('animationcomplete', onBombExplodedHandler, this);

    //this.body.setBoundsRectangle(new Phaser.Geom.Rectangle(200, 150, 400, 300));
    //this.setScale(0.9);
    //this.setSize(300, 300, true);
    //scene.physics.add.collider(this, scene.tiles, (a, b) => console.log(b));
  }

  update() {
    _checkMovement.call(this);
    _checkBombPlant.call(this);

    if (this.y < 30) {
      this.destroy();
    }
  }
}

// private -- !
