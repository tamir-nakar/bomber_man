class SubMenu_battleSettings extends Phaser.Scene {
  constructor() {
    super('sub_battleSettings');
    this.data = null;
    this.selections = [];
    this.alert = null;
  }

  preload() {
    this.load.image('play_bg', '/bmbrmn/assets/images/menu_items/play_bg.png');
  }
  init(data) {
    this.data = data;
    this.selections = [];
    this.alert = _createParagraph
      .call(
        this,
        350,
        LAYOUT.BOTTOM_MARGIN - 80,
        'You must choose 2-4 players',
        '#D40000'
      )
      .setDepth(2);
    this.alert.visible = false;
  }

  create() {
    this.add.image(480, 385, 'play_bg');

    new Button(this, LAYOUT.LEFT_MARGIN + 100, LAYOUT.BOTTOM_MARGIN + 30, 'BACK', () =>
      this.scene.start('menu')
    );

    new Button(
      this,
      LAYOUT.RIGHT_MARGIN - 100,
      LAYOUT.BOTTOM_MARGIN + 30,
      'Play',

      () => {
        const players = _getPlayers.call(this);
        if (players !== -1) {
          this.scene.start('playGame', {
            players: players,
            ...this.data
          });
        } else {
          this.alert.visible = true;
          setTimeout(() => (this.alert.visible = false), 3000);
        }
      }
    );

    let x = LAYOUT.LEFT_MARGIN * 4.5;
    let y = LAYOUT.TOP_MARGIN + 4 * LAYOUT.SPACE_UNIT;
    [1, 2, 3, 4].forEach(i => {
      _createPlayerPanel.call(this, x, y, i);
      y += 2.2 * LAYOUT.SPACE_UNIT;
    });
  }
}

function _createPlayerPanel(x, y, idx) {
  let t = _createTitle.call(this, x, y, `PLAYER ${idx}:`);

  this.selections.push(
    new Selection(this, t.x + 500, t.y + 15, ['Player', 'None'], 'player_options')
  );
}

function _getPlayers() {
  let res = [];
  this.selections.forEach((s, idx) => (s.value === 'Player' ? res.push(idx) : ''));
  return res.length >= 2 ? res : -1;
}
