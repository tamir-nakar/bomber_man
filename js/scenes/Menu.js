class Menu extends Phaser.Scene {
  constructor() {
    super('menu');
    this.buttons = [
      'campaign_btn',
      'pvp_btn',
      'pvAI_btn',
      'settings_btn',
      'instructions_btn'
    ];
    this.lastBombAnim = 0;
    this.hoverSpriteLeft = null;
    this.hoverSpriteRight = null;
    this.campaign_btn = null;
    this.pvp_btn = null;
    this.pvAI_btn = null;
    this.settings_btn = null;
    this.instructions_btn = null;
    this.currentSelectedBtn = 'campaign_btn';
    this.data = null;
  }

  preload() {
    this.load.image('campaign_btn', '../assets/images/menu_items/campaign.png');
    this.load.image('instructions_btn', '../assets/images/menu_items/instructions.png');
    this.load.image('pvp_btn', '../assets/images/menu_items/pvp.png');
    this.load.image('pvAI_btn', '../assets/images/menu_items/playerVsAI.png');
    this.load.image('settings_btn', '../assets/images/menu_items/settings.png');
  }
  init(data) {
    console.log(`menu got: ${JSON.stringify(data)}`);
    this.data = data;
  }
  create() {
    this.anims.create({
      key: 'menu_bomb1_anim',
      frames: this.anims.generateFrameNumbers('bomb1'),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'menu_bomb2_anim',
      frames: this.anims.generateFrameNumbers('bomb2'),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'menu_bomb3_anim',
      frames: this.anims.generateFrameNumbers('bomb3'),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'menu_bomb4_anim',
      frames: this.anims.generateFrameNumbers('bomb4'),
      frameRate: 6,
      repeat: -1
    });

    this.campaign_btn = this.add.image(550, 200, 'campaign_btn').setInteractive();
    this.campaign_btn.width = 261;
    this.pvp_btn = this.add.image(550, 300, 'pvp_btn').setInteractive();
    this.pvp_btn.width = 522;
    this.pvAI_btn = this.add.image(550, 400, 'pvAI_btn').setInteractive();
    this.pvAI_btn.width = 392;
    this.settings_btn = this.add.image(550, 500, 'settings_btn').setInteractive();
    this.settings_btn.width = 261;
    this.instructions_btn = this.add.image(550, 600, 'instructions_btn').setInteractive();
    this.instructions_btn.width = 391;

    _initHoverSprites.call(this);

    this.buttons.forEach(btn =>
      this[btn].on('pointerover', () => {
        if (this.currentSelectedBtn !== btn) {
          _selectMenuBtn.call(this, btn);
        }
      })
    );

    this.buttons.forEach(btn =>
      this[btn].on('pointerdown', () => {
        _menuBtnClickedHandler.call(this);
      })
    );

    this.input.keyboard.on('keydown-ENTER', function() {
      _menuBtnClickedHandler.call(this.scene);
    });

    this.input.keyboard.on('keydown-UP', () => {
      let idx = _getBtnIndex.call(this, this.currentSelectedBtn);
      idx = (idx + this.buttons.length - 1) % this.buttons.length;
      _selectMenuBtn.call(this, this.buttons[idx]);
    });

    this.input.keyboard.on('keydown-DOWN', () => {
      let idx = _getBtnIndex.call(this, this.currentSelectedBtn);
      idx = (idx + 1) % this.buttons.length;
      _selectMenuBtn.call(this, this.buttons[idx]);
    });
  }
  update() {}
}

function _getRandomBombAnim() {
  let rand;
  do {
    rand = Math.floor(Math.random() * 4 + 1);
  } while (rand === this.lastBombAnim);

  this.lastBombAnim = rand;
  return rand;
}

function _initHoverSprites() {
  const rand = _getRandomBombAnim.call(this);
  this.hoverSpriteLeft = this.add.sprite(
    this.campaign_btn.x - this.campaign_btn.width / 1.5,
    this.campaign_btn.y,
    'hoverSpriteLeft'
  );
  this.hoverSpriteLeft.setScale(1.4);
  this.hoverSpriteLeft.play(`menu_bomb${rand}_anim`);

  this.hoverSpriteRight = this.add.sprite(
    this.campaign_btn.x + this.campaign_btn.width / 1.5,
    this.campaign_btn.y,
    'hoverSpriteRight'
  );
  this.hoverSpriteRight.setScale(1.4);
  this.hoverSpriteRight.play(`menu_bomb${rand}_anim`);
}

function _selectMenuBtn(btnName) {
  this.hoverSpriteLeft.x = this[btnName].x - this[btnName].width / 1.5;
  this.hoverSpriteLeft.y = this[btnName].y;
  this.hoverSpriteRight.x = this[btnName].x + this[btnName].width / 1.5;
  this.hoverSpriteRight.y = this[btnName].y;
  const rand = _getRandomBombAnim.call(this);
  this.hoverSpriteRight.play(`menu_bomb${rand}_anim`);
  this.hoverSpriteLeft.play(`menu_bomb${rand}_anim`);
  this.currentSelectedBtn = btnName;
}

function _menuBtnClickedHandler() {
  switch (this.currentSelectedBtn) {
    case 'campaign_btn':
      break;
    case 'pvp_btn':
      //this.scene.start('playGame', { numPlayers: 3, ...this.data });
      this.scene.start('sub_battleSettings', { ...this.data });
      break;
    case 'pvAI_btn':
      this.scene.restart();
      break;
    case 'settings_btn':
      this.scene.start('sub_settings', { data: 'dataFromMEnu' });
      break;
    case 'instructions_btn':
      this.scene.start('sub_instructions');
      break;
  }
}

function _getBtnIndex(btnName) {
  for (let i = 0; i < this.buttons.length; i++) {
    if (this.buttons[i] === btnName) {
      return i;
    }
  }
  return 0;
}
