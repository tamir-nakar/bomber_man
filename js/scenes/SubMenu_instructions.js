class SubMenu_instructions extends Phaser.Scene {
  constructor() {
    super('sub_instructions');
  }

  preload() {}
  init() {}

  create() {
    //new Selection(this, 500, 500, ['Player', 'Computer', 'None']);
    new Button(
      this,
      LAYOUT.RIGHT_MARGIN - LAYOUT.SPACE_UNIT * 2,
      LAYOUT.BOTTOM_MARGIN - LAYOUT.SPACE_UNIT,
      'BACK',
      () => this.scene.start('menu')
    );

    let t = _createTitle.call(
      this,
      LAYOUT.LEFT_MARGIN,
      LAYOUT.TOP_MARGIN + LAYOUT.SPACE_UNIT,
      'GOAL:'
    );
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
    ta.y + LAYOUT.SPACE_UNIT,
    'Extra bomb',
    'The player can drop 1 more bomb in parallel.',
    'bomb_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT,
    'Fire power',
    'Explosion is growing by 1 tile each side. ',
    'fire_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT,
    'Speed',
    'The player gets 1 more speed unit.',
    'speed_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT,
    'Detonator',
    'The bombs are manually controlled. Use the detonator button to detonate them.',
    'detonate_powerup_anim'
  );

  t = _createPowerupSection.call(
    this,
    LAYOUT.LEFT_MARGIN + LAYOUT.SPACE_UNIT,
    t.y + LAYOUT.SPACE_UNIT,
    'Kicker',
    'The abillity to kick out bombs, when the player touch them.',
    'kick_powerup_anim'
  );
}

function _createPowerupSection(x, y, name, text, animName) {
  let t = _createSubtitle.call(this, x, y, name);

  t2 = _createParagraph.call(this, t.x, t.y + LAYOUT.SPACE_UNIT, text);

  this.add.sprite(t.x + LAYOUT.SPACE_UNIT * 3, t.y + 10).play(animName);

  return t2;
}
