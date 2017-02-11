import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    // load your assets
    game.load.image('bullet', 'assets/images/bullet.png');
    game.load.image('enemyBullet', 'assets/images/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/images/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'assets/images/player.png');
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);
    game.load.image('starfield', 'assets/images/starfield.png');
    game.load.image('background', 'assets/images/background2.png');
    game.load.audio('explosion','assets/audio/explosion.mp3');
    game.load.audio('levelclear','assets/audio/levelclear.mp3');
    game.load.audio('gameover','assets/audio/gameover.mp3')

    game.load.audio('pluto','assets/audio/pluto.mp3');
  }

  create () {
    this.state.start('Game')
  }

}
