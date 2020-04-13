class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
    this.data = null;
    this.isCheckEndGame = false;
    this.winner = null;
    this.playersRefs = [];
    this.playerIdToStatMap = {};

    this.playersDetails = [
      {
        // 1
        startLocation: {
          x: 90,
          y: 90
        },
        keyboard: {
          upKey: ['W', 87],
          downKey: ['S', 83],
          leftKey: ['A', 65],
          rightKey: ['D', 68],
          bombKey: ['E', 69],
          detonatorKey: ['Q', 81]
        },
        angle: ANGLES.RIGHT
      },
      {
        // 2
        startLocation: {
          x: 870,
          y: 155
        },
        keyboard: {
          upKey: ['UP', 38],
          downKey: ['DOWN', 40],
          leftKey: ['LEFT', 37],
          rightKey: ['RIGHT', 39],
          bombKey: ['ENTER', 13],
          detonatorKey: ['\\', 220]
        },
        angle: ANGLES.LEFT
      },
      {
        // 3
        startLocation: {
          x: 870,
          y: 550
        },
        keyboard: {
          upKey: ['Y', 89],
          downKey: ['H', 72],
          leftKey: ['G', 71],
          rightKey: ['J', 74],
          bombKey: ['U', 85],
          detonatorKey: ['T', 84]
        },
        angle: ANGLES.LEFT
      },
      {
        // 4
        startLocation: {
          x: 90,
          y: 550
        },
        keyboard: {
          upKey: ['L', 76],
          downKey: ['.', 190],
          leftKey: [',', 188],
          rightKey: ['/', 191],
          bombKey: [';', 186],
          detonatorKey: ['K', 75]
        },
        angle: ANGLES.RIGHT
      }
    ];
  }

  updateStats(id, stats) {
    const stat = this.playerIdToStatMap[id];

    if (!stats.isDead) {
      stat.setBombs(stats.bombs);
      stat.setFire(stats.fire);
      stat.setSpeed(stats.speed);
      stat.setDetonator(stats.detonator);
      stat.setKicker(stats.kicker);
    } else {
      // dead
      //console.log('dead');
    }
  }
  init(data) {
    //console.log(`Scene2 got: ${JSON.stringify(data)}`);
    this.winner = null;

    if (data) {
      this.data = data;
    }
  }
  create() {
    this.add.image(479, 705, 'statsPanel').setDepth(0);
    this.promptWindow = this.add.image(500, 300, 'promptWindow');
    this.promptWindow.setDepth(2);
    this.promptWindow.visible = false;
    this.promptWindow.txt = this.add.text(
      this.promptWindow.x - 200,
      this.promptWindow.y - 50,
      '',
      {
        font: '42px Arial'
      }
    );

    this.input.keyboard.on('keydown', a => {
      if (a.keyCode === 27) {
        this.scene.start('menu');
      }
    });

    this.map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    const metalTileset = this.map.addTilesetImage('metal');
    const boxTileset = this.map.addTilesetImage('box');
    const bgTileset = this.map.addTilesetImage('ground_bg', 'bg');
    // Groups
    this.explosions = this.add.group();
    this.bombs = this.add.group();
    this.p1_bombs = this.add.group();
    this.p2_bombs = this.add.group();
    this.p3_bombs = this.add.group();
    this.p4_bombs = this.add.group();
    this.powerUps = this.add.group();
    this.players = this.add.group();
    this.map.createStaticLayer('bg_layer', [bgTileset]);
    const top_layer = this.map.createDynamicLayer('block_layer', [
      boxTileset,
      metalTileset
    ]);
    this.top_layer = top_layer;
    top_layer.setCollisionByProperty({ collides: true });
    _createPlayers.call(this, this.data.players); // this.data.numPlayers;
    _createPlayersStat.call(this, this.data.players);
    this.isCheckEndGame = true;
    //this.scene.restart();

    this.physics.add.collider(this.players, top_layer);

    this.physics.add.collider(this.bombs, top_layer);
    this.physics.add.collider(this.bombs);
    this.physics.add.overlap(this.powerUps, this.explosions, powerup =>
      powerup.destroy()
    );
    this.physics.add.overlap(this.bombs, this.explosions, bomb => bomb.explode());
  }

  update() {
    this.players.getChildren().forEach(p => (p ? p.update() : ''));
    if (this.isCheckEndGame) {
      _handleEndGame.call(this);
    }
  }
}
function _createPlayers(players) {
  players.forEach(idx => {
    const keyBoard =
      this.data && this.data.keyBoards
        ? this.data.keyBoards[idx]
        : this.playersDetails[idx].keyboard;

    this.playersRefs[idx] = new Player(
      this,
      this.playersDetails[idx].startLocation.x,
      this.playersDetails[idx].startLocation.y,
      keyBoard,
      this.playersDetails[idx].angle,
      idx + 1,
      PLAYERS.COLORS[idx]
    );
  });
}

function _handleEndGame() {
  const remainPlayers = this.players.getChildren().length;
  const idxToFill = ['#3A9DEB', '#43865D', '#AE7A1E', '#FFF867'];

  if (remainPlayers === 1 || remainPlayers == 0) {
    const id = this.players.getChildren()[0].id;
    const idx = id - 1;
    this.winner = remainPlayers ? `PLAYER ${id}` : `DRAW`;
    this.isCheckEndGame = false;
    this.promptWindow.visible = true;
    this.promptWindow.txt.setText(`${this.winner} WIN !!!`);
    this.promptWindow.txt.setStyle({
      fill: idxToFill[idx]
    });
    this.promptWindow.txt.visible = true;
    this.promptWindow.txt.setDepth(3);
    this.add
      .sprite(
        this.promptWindow.txt.x + this.promptWindow.txt.width + 50,
        this.promptWindow.txt.y + 15,
        `player${id}`
      )
      .setDepth(3)
      .play(`player${id}_walk`);
    this.add
      .text(this.promptWindow.txt.x + 350, this.promptWindow.txt.y + 140, 'Play again', {
        fill: '#ffffff'
      })
      .setInteractive()
      .setDepth(3)
      .on('pointerdown', () => this.scene.restart());
    this.add
      .text(
        this.promptWindow.txt.x - 70,
        this.promptWindow.txt.y + 140,
        'Return to menu',
        {
          fill: '#ffffff'
        }
      )
      .setInteractive()
      .setDepth(3)
      .on('pointerdown', () => this.scene.start('menu'));
  }
}

function _createSinglePlayerStat(idx, x, y) {
  const stat = {
    bombsTxt: null,
    fireTxt: null,
    speedTxt: null,
    kickerSprite: null,
    detonatorSprite: null,
    isDetonator: false,
    isKicker: false,
    setBombs: function(v) {
      this.bombsTxt.setText(v);
    },
    setFire: function(v) {
      this.fireTxt.setText(v);
    },
    setSpeed: function(v) {
      this.speedTxt.setText(v);
    },
    setDetonator: function(v) {
      //debugger;
      if (!this.isDetonator) {
        if (v) {
          this.isDetonator = true;
          //console.log(this.detonatorSprite);
          this.detonatorSprite.visible = true;
        }
      }
    },
    setKicker: function(v) {
      //debugger;
      if (!this.isKicker) {
        //console.log(this.kickerSprite);

        if (v) {
          this.isKicker = true;
          this.kickerSprite.visible = true;
        }
      }
    }
  };

  let t = _createSubtitle.call(this, x, y, `PLAYER ${idx + 1}`, PLAYERS.COLORS[idx]);
  t = this.add.sprite(t.x + 10, t.y + 50, 'power_ups', 6);
  stat.bombsTxt = _createParagraph.call(this, t.x + 20, t.y - 10, '1');
  let f = this.add.sprite(t.x, t.y + 35, 'power_ups', 0);
  stat.fireTxt = _createParagraph.call(this, t.x + 20, t.y + 25, '1');
  let s = this.add.sprite(t.x + 70, t.y, 'power_ups', 18);
  stat.speedTxt = _createParagraph.call(this, t.x + 90, t.y - 10, '1');
  stat.kickerSprite = this.add.sprite(s.x - 12, f.y + 2, 'power_ups', 24);
  stat.kickerSprite.visible = false;
  stat.detonatorSprite = this.add.sprite(s.x + 22, f.y + 2, 'power_ups', 12);
  stat.detonatorSprite.visible = false;

  this.playerIdToStatMap[idx + 1] = stat;
}

function _createPlayersStat(playersIdxs) {
  const y = 653;
  let x = 120;
  for (let i = 0; i < playersIdxs.length; i++, x += 200) {
    _createSinglePlayerStat.call(this, playersIdxs[i], x, y);
  }
}
