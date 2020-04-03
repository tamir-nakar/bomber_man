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

    scene.physics.add.overlap(this, scene.player, () => {
      switch (this.type) {
        case 'fire':
          scene.player.increaseFirePower();
          break;
        case 'bomb':
          scene.player.increaseNumBombs();
          break;
        case 'kick':
          scene.player.turnOnKicker();
          break;
        case 'detonate':
          scene.player.turnOnDetonator();
          break;
        case 'speed':
          scene.player.increaseSpeed();
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
  // speed, kick-bomb, demolition
  const rand = Math.floor(Math.random() * 100 + 1);

  if (rand <= 20) {
    return 'fire';
  } else if (rand >= 21 && rand <= 40) {
    return 'speed';
  } else if (rand >= 41 && rand <= 60) {
    return 'kick';
  } else if (rand >= 61 && rand <= 80) {
    return 'detonate';
  } else {
    return 'bomb';
  }
}
