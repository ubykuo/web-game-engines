import Phaser from 'phaser'

var about;

export default class extends Phaser.State {

  init() {
    //  About information text
    about = game.add.text(400,400,"Space invaders game test made with Phaser for Ubykuo", {font:"Bangers", fontSize: 22,fill:"#000",align:"center"});
    about.visible = false;
    about.anchor.setTo(0.5, 0.5);
  }

  preload () {
    //  Images and sprites
    game.load.image('bullet', 'assets/images/bullet.png');
    game.load.image('enemyBullet', 'assets/images/enemy-bullet.png');
    game.load.image('ship', 'assets/images/player.png');
    game.load.image('starfield', 'assets/images/starfield.png');
    game.load.image('background', 'assets/images/background2.png');
    game.load.image('volumeon', 'assets/images/volumeon.png');
    game.load.image('menubutton', 'assets/images/menubutton.png');

    game.load.spritesheet('invader', 'assets/images/invader32x32x4.png', 32, 32);
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);


    //  Sound
    game.load.audio('explosion','assets/audio/explosion.mp3');
    game.load.audio('levelclear','assets/audio/levelclear.mp3');
    game.load.audio('gameover','assets/audio/gameover.mp3')

    //  Music
    game.load.audio('pluto','assets/audio/pluto.mp3');
  }
  
  create () {
    //  Play button
    this.createButton(game, 400, 280, 200, 50, 'Play Game', function () { 
      this.state.start('Game')});

    //  About button
    this.createButton(game, 400, 330, 200, 50, 'About', function () {
      about.visible ? about.visible = false : about.visible = true;
    });    
  }

  createButton(game, x , y, w, h, title, callback) {
    var button = game.add.button(x, y,'menubutton', callback, this, 2, 1, 0);
    button.anchor.setTo(0.5,0.5);
    button.height = h;
    button.width = w;
    var txt = game.add.text(button.x,button.y,title, {font:"Bangers", fill:"#fff",align:"center"});
    txt.anchor.setTo(0.5,0.5);
  }
}
