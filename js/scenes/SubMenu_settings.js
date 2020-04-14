class SubMenu_settings extends Phaser.Scene {
  constructor() {
    super('sub_settings');
    this.changeKeyTxt = null;
    this.margin = 80;
    this.isNewKeysetChanged = false;
    this.alertTxt = null;
    this.buttons = [];
    this.keyInput = null;
    this.selectedKey = null;
    this.defaultKeySet = [
      {
        //1
        upKey: ['W', 87],
        downKey: ['S', 83],
        leftKey: ['A', 65],
        rightKey: ['D', 68],
        bombKey: ['E', 69],
        detonatorKey: ['Q', 81]
      },
      {
        //2
        upKey: ['UP', 38],
        downKey: ['DOWN', 40],
        leftKey: ['LEFT', 37],
        rightKey: ['RIGHT', 39],
        bombKey: ['ENTER', 13],
        detonatorKey: ['\\', 220]
      },
      {
        //3
        upKey: ['Y', 89],
        downKey: ['H', 72],
        leftKey: ['G', 71],
        rightKey: ['J', 74],
        bombKey: ['U', 85],
        detonatorKey: ['T', 84]
      },
      {
        //4
        upKey: ['L', 76],
        downKey: ['>', 190],
        leftKey: ['<', 188],
        rightKey: ['/', 191],
        bombKey: ['K', 186],
        detonatorKey: [';', 75]
      }
    ];
    this.newKeySet = [
      {
        //1
        upKey: ['W', 87],
        downKey: ['S', 83],
        leftKey: ['A', 65],
        rightKey: ['D', 68],
        bombKey: ['E', 69],
        detonatorKey: ['Q', 81]
      },
      {
        //2
        upKey: ['UP', 38],
        downKey: ['DOWN', 40],
        leftKey: ['LEFT', 37],
        rightKey: ['RIGHT', 39],
        bombKey: ['ENTER', 13],
        detonatorKey: ['\\', 220]
      },
      {
        //3
        upKey: ['Y', 89],
        downKey: ['H', 72],
        leftKey: ['G', 71],
        rightKey: ['J', 74],
        bombKey: ['U', 84],
        detonatorKey: ['T', 85]
      },
      {
        //4
        upKey: ['L', 76],
        downKey: ['.', 190],
        leftKey: [',', 188],
        rightKey: ['/', 191],
        bombKey: [';', 186],
        detonatorKey: ['K', 75]
      }
    ];
    this.isAllowedKeyChange = false;
  }

  preload() {
    this.load.image('settings_bg', '/bmbrmn/assets/images/menu_items/settings_bg.png');
    this.load.image('upKey', '/bmbrmn/assets/images/menu_items/upKey.png');
    this.load.image('downKey', '/bmbrmn/assets/images/menu_items/downKey.png');
    this.load.image('leftKey', '/bmbrmn/assets/images/menu_items/leftKey.png');
    this.load.image('rightKey', '/bmbrmn/assets/images/menu_items/rightKey.png');
    this.load.image('detonatorKey', '/bmbrmn/assets/images/menu_items/detonatorKey.png');
    this.load.image('bombKey', '/bmbrmn/assets/images/menu_items/bombKey.png');
  }
  init(data) {
    this.changeKeyTxt = this.add
      .text(290, 165, 'PRESS ANY KEY TO EXCHANGE WITH', {
        font: '20px Arial',
        fill: '#34db5b'
      })
      .setDepth(2);
    this.changeKeyTxt.visible = false;
    this.alertText = this.add
      .text(250, 590, 'TWO OR MORE KEYS POINTING TO THE SAME BUTTON', {
        font: '20px Arial',
        fill: '#ce0000'
      })
      .setDepth(2);
    this.alertText.visible = false;
    new Button(
      this,
      LAYOUT.RIGHT_MARGIN - 100,
      LAYOUT.BOTTOM_MARGIN + 30,
      'SAVE & EXIT',
      () => _saveAndExitHandler.call(this)
    ).alignTextRelative(-30, 0);

    new Button(
      this,
      LAYOUT.LEFT_MARGIN + 100,
      LAYOUT.BOTTOM_MARGIN + 30,
      'BACK TO MENU',
      () => this.scene.start('menu')
    )
      .alignTextRelative(-35, 0)
      .setStyle({ font: '17px Arial' });
  }

  create() {
    this.add.image(480, 385, 'settings_bg');
    this.anims.create({
      key: 'Menu_player1_walk',
      frames: this.anims.generateFrameNumbers('player1'),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'Menu_player2_walk',
      frames: this.anims.generateFrameNumbers('player2'),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'Menu_player3_walk',
      frames: this.anims.generateFrameNumbers('player3'),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'Menu_player4_walk',
      frames: this.anims.generateFrameNumbers('player4'),
      frameRate: 5,
      repeat: -1
    });
    //this.scene.start('menu', { data: 15 });

    this.newKeySet.forEach((ks, idx) =>
      _createKeySet.call(
        this,
        idx,
        ks.upKey[0],
        ks.downKey[0],
        ks.leftKey[0],
        ks.rightKey[0],
        ks.bombKey[0],
        ks.detonatorKey[0]
      )
    );

    // key selected
    this.buttons.forEach(btn =>
      btn.on('pointerdown', () => {
        this.selectedKey = btn;
        this.changeKeyTxt.visible = true;
        this.isAllowedKeyChange = true;
        btn.setScale(0.5);
      })
    );

    this.input.keyboard.on('keyup', a => {
      if (this.isAllowedKeyChange) {
        this.selectedKey.txt.setText(a.key.toUpperCase());
        this.newKeySet[this.selectedKey.keysetId][
          this.selectedKey.keyId
        ][0] = a.key.toUpperCase();
        this.newKeySet[this.selectedKey.keysetId][this.selectedKey.keyId][1] = a.keyCode;

        this.isAllowedKeyChange = false;
        this.changeKeyTxt.visible = false;
        this.isNewKeysetChanged = true;
        this.selectedKey.setScale(1);
        this.selectedKey.txt.setFont('15px Arial');
      }
    });

    this.buttons.forEach(btn =>
      btn.on('pointerover', () => {
        if (!this.changeKeyTxt.visible) {
          btn.setScale(0.9);
          btn.txt.setFont('13px Arial');
        }
      })
    );

    this.buttons.forEach(btn =>
      btn.on('pointerout', () => {
        if (!this.changeKeyTxt.visible) {
          btn.setScale(1);
          btn.txt.setFont('15px Arial');
        }
      })
    );
  }
  update() {}
}

function _createKeySet(idx, upSym, downSym, leftSym, rightSym, bombSym, detonatorSym) {
  const idxToCoord = [
    [300, 250],
    [750, 250],
    [300, 450],
    [750, 450]
  ];
  const idxToFill = ['#3A9DEB', '#43865D', '#AE7A1E', '#FFF867'];
  const x = idxToCoord[idx][0];
  const y = idxToCoord[idx][1];
  this.add.text(x - 230, y - 20, `Player ${idx + 1}`, {
    font: '23px Arial',
    fill: idxToFill[idx]
  });
  const z = this.add.sprite(x - 200, y + 55);
  z.play(`Menu_player${idx + 1}_walk`, true);

  const up = this.add.image(x, y, 'upKey').setInteractive();
  up.txt = this.add.text(up.x - 20, up.y - 20, upSym, {
    font: '15px Arial',
    fill: '#000000'
  });
  up.keyId = 'upKey';
  up.keysetId = idx;
  const left = this.add
    .image(x - this.margin, y + this.margin, 'leftKey')
    .setInteractive();
  left.txt = this.add.text(left.x - 20, left.y - 20, leftSym, {
    font: '15px Arial',
    fill: '#000000'
  });
  left.keyId = 'leftKey';
  left.keysetId = idx;

  const down = this.add.image(x, y + this.margin, 'downKey').setInteractive();
  down.txt = this.add.text(down.x - 20, down.y - 20, downSym, {
    font: '15px Arial',
    fill: '#000000'
  });
  down.keyId = 'downKey';
  down.keysetId = idx;
  const right = this.add
    .image(x + this.margin, y + this.margin, 'rightKey')
    .setInteractive();
  right.txt = this.add.text(right.x - 20, right.y - 20, rightSym, {
    font: '15px Arial',
    fill: '#000000'
  });
  right.keyId = 'rightKey';
  right.keysetId = idx;

  const bomb = this.add.image(x + this.margin, y, 'bombKey').setInteractive();
  bomb.txt = this.add.text(bomb.x - 20, bomb.y - 20, bombSym, {
    font: '15px Arial',
    fill: '#000000'
  });
  bomb.keyId = 'bombKey';
  bomb.keysetId = idx;

  const detonator = this.add.image(x - this.margin, y, 'detonatorKey').setInteractive();
  detonator.txt = this.add.text(detonator.x - 20, detonator.y - 20, detonatorSym, {
    font: '15px Arial',
    fill: '#000000'
  });
  detonator.keyId = 'detonatorKey';
  detonator.keysetId = idx;

  this.buttons.push(up);
  this.buttons.push(left);
  this.buttons.push(down);
  this.buttons.push(right);
  this.buttons.push(bomb);
  this.buttons.push(detonator);
}

function _saveAndExitHandler() {
  if (this.isNewKeysetChanged) {
    if (_checkNewKeySetValidity.call(this)) {
      this.scene.start('menu', { keyBoards: this.newKeySet });
    } else {
      this.alertText.visible = true;
      setTimeout(()=> this.alertText.visible=false, 2000)
    }
  } else {
    this.scene.start('menu');
  }
}

function _checkNewKeySetValidity() {
  const set = new Set();

  this.newKeySet.forEach(keySet =>
    Object.keys(keySet).forEach(e => set.add(keySet[e][1]))
  );

  return set.size === 24;
}
