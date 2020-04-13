class SubMenu_battleSettings extends Phaser.Scene {
  constructor() {
    super('sub_battleSettings');
    this.data = null;
    this.selections = [];
    this.alert = null;
  }

  init(data) {
    this.data = data;
    this.selections = [];
    this.alert = _createParagraph.call(
      this,
      400,
      LAYOUT.BOTTOM_MARGIN,
      'You must choose 2-4 players'
    );
    this.alert.visible = false;
  }

  create() {
    new Button(
      this,
      LAYOUT.RIGHT_MARGIN - LAYOUT.SPACE_UNIT * 2,
      LAYOUT.BOTTOM_MARGIN - LAYOUT.SPACE_UNIT,
      'BACK',
      () => this.scene.start('menu')
    );

    new Button(
      this,
      LAYOUT.RIGHT_MARGIN - LAYOUT.SPACE_UNIT * 7,
      LAYOUT.BOTTOM_MARGIN - LAYOUT.SPACE_UNIT,
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

    let x = LAYOUT.LEFT_MARGIN * 4;
    let y = LAYOUT.TOP_MARGIN + LAYOUT.SPACE_UNIT;
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
