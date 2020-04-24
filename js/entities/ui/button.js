class Button extends Phaser.GameObjects.Image {
  constructor(scene, x, y, text, callback, img = 'btn_simple') {
    super(scene, x, y, img);
    this.scene = scene;
    this.scene.add.existing(this, true);
    this.text = null;
    this.isSelected = false;
    this._init(x, y, text);
    this.playAction = callback;
    this.isDown = false;
  }

  get isDownn() {
    return this.isDownn;
  }

  // set isDownn(val) {
  //   this.isDownn = val;
  // }
  setStyle(styleObj) {
    this.text.setStyle(styleObj);
    return this;
  }

  alignTextRelative(x, y) {
    this.text.x += x;
    this.text.y += y;
    return this;
  }

  _init(x, y, text) {
    this.setDepth(3);
    this.setInteractive();

    // Init members
    this.text = this.scene.add
      .text(x - 30, y - 12, text, {
        font: '20px Arial',
        fill: '#000000',
        align: 'center',
      })
      .setDepth(3);

    // Init events
    this.on('pointerover', () => {
      this.isSelected = true;
      this.setScale(0.95);
      this.setTint(0xff9955);
    });

    this.on('pointerout', () => {
      this.isSelected = false;
      this.isDown = false;
      this.setScale(1);
      this.setTint();
    });

    this.on('pointerdown', () => {
      this.isDown = true;
      this.playAction();
    });

    this.scene.input.keyboard.on('keydown-ENTER', () => {
      if (this.isSelected) {
        this.playAction();
      }
    });
  }
}
