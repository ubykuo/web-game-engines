/* globals __DEV__ */
import Phaser from 'phaser'

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var explosionSound;
var levelClearSound;
var gameOverSound;
var plutoMusic;
var musicEnabled = true;
var button;
var enemyFireRate = 2000;
export default class extends Phaser.State {

  create () {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    button = game.add.button(game.world.centerX + 300, 90, 'volumeon', this.buttonClick, this, 2, 1, 0);

    //  Our bullet group
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    this.enemyBullets = game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(30, 'enemyBullet');
    this.enemyBullets.setAll('anchor.x', 1);
    this.enemyBullets.setAll('anchor.y', 1);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    this.player = game.add.sprite(400, 500, 'ship');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    //  Collide with world bounds (left and right)
    this.player.body.collideWorldBounds = true;

    //  The baddies!
    this.aliens = game.add.group();
    this.aliens.enableBody = true;
    this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

    this.createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score + '       ', { font: '34px Bangers', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Bangers', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Bangers', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    //  Sounds
    explosionSound = game.add.audio('explosion');
    levelClearSound = game.add.audio('levelclear');
    gameOverSound = game.add.audio('gameover',1,true); 
    plutoMusic = game.add.audio('pluto',1,true);

    // We have to decode the sounds first, since they are MP3 encoded
    game.sound.setDecodedCallback([explosionSound, levelClearSound,gameOverSound, plutoMusic], this.soundSet, this);

    // Create 3 game lives
    for (var i = 0; i < 3; i++) 
    {
      var ship = lives.create(game.world.width - 100 + (30 * i), 70, 'ship');
      ship.anchor.setTo(0.5, 0.5);
      ship.angle = 90;
      ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(this.setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

   // Player alive actions
   if (this.player.alive)
   {
        //  Reset the player, then check for movement keys
        this.player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
          this.player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
         this.player.body.velocity.x = 200;
       }

        //  Firing?
        if (fireButton.isDown)
        {
          this.fireBullet();
        }

        // Enemy can fire
        if (game.time.now > firingTimer)
        {
          this.enemyFires();
        }

        //  Alien Bullet vs. Player collision
        game.physics.arcade.overlap(this.bullets, this.aliens, this.collisionHandler, null, this);
        //  Alien Bullet vs. Player collision
        game.physics.arcade.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
        //  Alien Bullet vs. Player Bullet collision
        game.physics.arcade.overlap(this.enemyBullets, this.bullets, this.bulletCollisions, null, this);
      }

    }

    createAliens () {

      for (var y = 0; y < 2; y++)
      {
        for (var x = 0; x < 1; x++)
        {
          var alien = this.aliens.create(x * 48, y * 50, 'invader');
          alien.anchor.setTo(0.5, 0.5);
          alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
          alien.play('fly');
          alien.body.moves = false;
        }
      }

      this.aliens.x = 100;
      this.aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(this.aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(this.descend, this);
  }

  setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

  }

  descend() {

    this.aliens.y += 10;

  }

  collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);
    //  Play explosion sound 
    explosionSound.play();

    // All the aliens have been killed 
    if (this.aliens.countLiving() == 0)
    {
      score += 1000;
      scoreText.text = scoreString + score;

      this.enemyBullets.callAll('kill',this);
      stateText.text = " You Won, \n Click to restart   ";
      stateText.visible = true;

      plutoMusic.stop();
      levelClearSound.play();
      //the "click to restart" handler
      game.input.onTap.addOnce(this.restart,this);
    }
  }

    enemyHitsPlayer (player,bullet) {

      bullet.kill();

      var live = lives.getFirstAlive();

      if (live)
      {
        live.kill();
      }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);
    explosionSound.play();

    // When the player dies
    if (lives.countLiving() < 1)
    {
      player.kill();
      this.enemyBullets.callAll('kill');

      stateText.text="      GAME OVER \n Click to restart  ";
      stateText.visible = true;

      plutoMusic.stop();
      gameOverSound.play();

      //the "click to restart" handler
      game.input.onTap.addOnce(this.restart,this);
    }
  }

  enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = this.enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    this.aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
      });


    if (enemyBullet && livingEnemies.length > 0)
    {

      var random = game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter = livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,this.player,300); // 550 = bullet speed in milliseconds
        firingTimer = game.time.now + enemyFireRate; //  2000 = fire ratio in milliseconds
      }
    }

    fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        var bullet = this.bullets.getFirstExists(false);

        //  Available bullet to use from the pool 
        if (bullet)
        {
            //  And fire it
            bullet.reset(this.player.x, this.player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 1000;// 1000 = fire rate in milliseconds
          }
        }
      }

      resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

  }

  restart () {

    //  A new level starts
    levelClearSound.stop();
    gameOverSound.stop();
    musicEnabled ? plutoMusic.play() : '';

    //  Resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    this.aliens.removeAll();
    this.createAliens();

    //  Revives the player
    this.player.revive();
    //  Hides the text
    stateText.visible = false;

  }

  //  MP3 files are ready to use
  soundSet() {
    plutoMusic.play();
  }

  //  Bullet vs. Bullet collision
  bulletCollisions (playerBullet, alienBullet) {

    //  Bullet hits another bullet
    playerBullet.kill();
    alienBullet.kill();

    //  Explosion animation and sound
    var explosion = explosions.getFirstExists(false);
    explosion.reset(playerBullet.body.x, playerBullet.body.y);
    explosion.play('kaboom', 30, false, true);
    explosionSound.play();
  }
  
  //  Music button handler
  buttonClick() {
    if(musicEnabled) {
      plutoMusic.pause();
      musicEnabled = false;
    } else {
      plutoMusic.resume();
      musicEnabled = true;
    }
  }
}

