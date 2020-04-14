class SubMenu_instructions extends Phaser.Scene {
  constructor() {
    super('sub_instructions');
  }

  preload() {
    this.load.image('instructions_bg', '/bmbrmn/assets/images/menu_items/instructions_bg.png');
  }
  init() {}

  create() {
    //new Selection(this, 500, 500, ['Player', 'Computer', 'None']);
    this.add.image(480, 385, 'instructions_bg');

    new Button(this, LAYOUT.RIGHT_MARGIN - 100, LAYOUT.BOTTOM_MARGIN + 30, 'BACK', () =>
      this.scene.start('menu')
    );

    let t = _createTitle.call(this, LAYOUT.LEFT_MARGIN, LAYOUT.TOP_MARGIN + 100, 'GOAL:');
    t = _createParagraph.call(
      this,
      LAYOUT.LEFT_MARGIN,
      t.y + LAYOUT.SPACE_UNIT,
      "Bomb everyone. Don't get bombed."
    );

    t = _createTitle.call(this, LAYOUT.LEFT_MARGIN, t.y + LAYOUT.SPACE_UNIT, 'POWERUPS:');

    _createPowerUpsSections.call(this, t);
  }
  update() {}
}

function _createPowerUpsSections(ta) {
  let t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    ta.y + LAYOUT.SPACE_UNIT * 1.5,
    'Extra bomb',
    'The player can drop 1 more bomb in the same time.',
    'bomb_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT * 1.5,
    'Fire power',
    'Explosion is growing by 1 tile each side. ',
    'fire_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT * 1.5,
    'Speed',
    'The player gets 1 more speed unit.',
    'speed_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT * 1.5,
    'Detonator',
    'The bombs are manually controlled.\nUse the detonator button to detonate them.',
    'detonate_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT * 1.5,
    'Kicker',
    'The abillity to kick out bombs, when the player touch them.',
    'kick_powerup_anim'
  );
}

function _createPowerupSection(x, y, name, text, animName) {
  let t = _createSubtitle.call(this, x, y, name);

  t2 = _createParagraph.call(this, t.x + LAYOUT.SPACE_UNIT * 5, t.y, text);

  this.add.sprite(t.x + LAYOUT.SPACE_UNIT * 3, t.y + 10).play(animName);

  return t2;
}
