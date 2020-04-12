const gameSettings = {
  playerSpeed: 200
};

const config = {
  width: 960,
  height: 720, // 640
  backgroundColor: 0x000000,
  scene: [Scene1, SubMenu_instructions, Menu, SubMenu_settings, Scene2],
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
