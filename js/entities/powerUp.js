class PowerUp extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'powerUp');
    scene.add.existing(this, true);
    scene.physics.world.enableBody(this);
    this.body.moves = false;

    this.type = _getRandomType.call(this);

    //this.body.offset.x = 30;
    //this.body.offset.y = 30;
    scene.powerUps.add(this);

    //this.scene.physics.add.overlap(this, this.explosions, () => this.destroy);

    if (this.type) {
      this.play(`${this.type}_powerup_anim`);
    }

    scene.physics.add.overlap(this, scene.players, (_, player) => {
      switch (this.type) {
        case 'fire':
          player.increaseFirePower();
          break;
        case 'bomb':
          player.increaseNumBombs();
          break;
        case 'kick':
          player.turnOnKicker();
          break;
        case 'detonate':
          player.turnOnDetonator();
          break;
        case 'speed':
          player.increaseSpeed();
          break;
      }
      this.destroy();
    });
    // this.on(
    //   'animationcomplete',
    //   () => {
    //     onBombExplodedHandler();
    //     new Explosion(scene, this.x, this.y, 2);
    //     this.destroy();
    //   },
    //   this
    // );
  }

  update() {}
}

// private -- !

function _getRandomType() {
  const rand = Math.floor(Math.random() * 100 + 1);

  if (rand <= 30) {
    return 'bomb';
  } else if (rand >= 31 && rand <= 60) {
    return 'fire';
  } else if (rand >= 61 && rand <= 80) {
    return 'speed';
  } else if (rand >= 81 && rand <= 90) {
    return 'detonate';
  } else {
    return 'kick';
  }
}
