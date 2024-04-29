class Selection extends Phaser.GameObjects.Image {
  constructor(scene, x, y, optionsArr, spriteName) {
    super(scene, x, y, 'btn_simple');
    this.scene = scene;
    this.scene.add.existing(this, true);
    this.text = null;
    this.currentOption = 0;
    this.isSelected = false;
    this.optionsArr = optionsArr;
    this.playAction = null;
    this.spriteName = spriteName;
    this._init(x, y);
    this.setScale(1.15);
  }

  get value() {
    return this.optionsArr[this.currentOption];
  }

  setStyle(styleObj) {
    this.text.setStyle(styleObj);
    return this;
  }

  alignTextRelative(x, y) {
    this.text.x += x;
    this.text.y += y;
    return this;
  }

  _init(x, y) {
    this.setDepth(3);
    this.setInteractive();
    // Init members
    this.text = this.scene.add
      .text(x - 14, y - 9, this.optionsArr[this.currentOption], {
        font: '18px Arial',
        fill: '#000000',
        align: 'center'
      })
      .setDepth(3);

    this.sprite = this.scene.add.sprite(x - 45, y - 3, this.spriteName).setDepth(3);
    this.playAction = () => {
      this.currentOption = (this.currentOption + 1) % this.optionsArr.length;
      this.text.setText(this.optionsArr[this.currentOption]);
      this.sprite.setFrame(this.currentOption);
    };
    // Init events
    this.on('pointerover', () => {
      this.isSelected = true;
      this.setTint(0xff9955);
    });

    this.on('pointerout', () => {
      this.isSelected = false;
      this.setScale(1.15);
      this.setTint();
    });

    this.on('pointerdown', () => {
      this.playAction();
    });

    this.scene.input.keyboard.on('keydown-ENTER', () => {
      if (this.isSelected) {
        this.playAction();
      }
    });
  }
}
