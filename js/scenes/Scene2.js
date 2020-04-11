class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
    this.data = null;
    this.isCheckEndGame = false;
    this.winner = null;
    this.playersRefs = [];

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

  init(data) {
    console.log(`Scene2 got: ${JSON.stringify(data)}`);
    this.winner = null;

    if (data) {
      this.data = data;
    }
  }
  create() {
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
    _createPlayers.call(this, 4); // this.data.numPlayers;
    this.isCheckEndGame = true;
    //this.scene.restart();

    this.physics.add.collider(this.players, top_layer);

    this.physics.add.collider(this.bombs, top_layer);
    this.physics.add.collider(this.bombs);
    this.physics.add.overlap(this.powerUps, this.explosions, powerup =>
      powerup.destroy()
    );
    this.physics.add.overlap(this.bombs, this.explosions, bomb => bomb.explode());

    const text = this.add.text(50, 650, '', { font: '22px Courier', fill: '#00ff00' });
    let a = 12;
    text.setText(['Level: ' + a, 'Lives: ' + 17, 'Score: ' + 18]);
  }

  update() {
    this.players.getChildren().forEach(p => (p ? p.update() : ''));
    if (this.isCheckEndGame) {
      _handleEndGame.call(this);
    }
  }
}
function _createPlayers(numPlayers) {
  for (let i = 0; i < numPlayers; i++) {
    const keyBoard =
      this.data && this.data.keyBoards
        ? this.data.keyBoards[i]
        : this.playersDetails[i].keyboard;

    this.playersRefs[i] = new Player(
      this,
      this.playersDetails[i].startLocation.x,
      this.playersDetails[i].startLocation.y,
      keyBoard,
      this.playersDetails[i].angle,
      i + 1
    );
  }
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
