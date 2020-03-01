class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
    this.boardManager = new BoardManager(this);
  }

  create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, 'bg');
    this.background.setOrigin(0, 0);
    this.boardManager.initBoard();

    this.player = new Player(
      this,
      90,
      90,
      this.input.keyboard.createCursorKeys(),
      ANGLES.RIGHT
    );
    this.player.setActive(true);
  }
  update() {
    this.player.update();
  }
}
