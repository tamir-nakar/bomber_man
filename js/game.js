const gameSettings = {
  playerSpeed: 200,
};

const config = {
  //width: 960,
  //height: 770, // 640
  backgroundColor: 0x000000,
  scene: [
    Scene1,
    SubMenu_instructions,
    SubMenu_battleSettings,
    Menu,
    SubMenu_settings,
    Scene2,
  ],
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    parent: 'yourgamediv',
    mode: Phaser.Scale.FIT,
    width: 960,
    height: 770, // 640
    //autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: ['rexvirtualjoystickplugin'],
};

const game = new Phaser.Game(config);
