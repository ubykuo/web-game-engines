#Spacer Invader game made with Phaser

##Current features:

- Animations
- Music
- Sound
- Collisions
- States
- Score
- Lives
- Menu
- Buttons


#Phaser:

##PROS:

- Uses PIXI WebGL and Canvas rendering engine (desktop an mobile support)
- Easy to understand what the code does by just looking at it once 
- No complex calculations or verbose stuff for most of the things
- Simplicity
- Plugin system
- Great amount of official tutorials (685 approx) and big community/forums
- Lots of boilerplate code (puzzles, arcade, space, RPG, drawing, music player, etc)
- Default physics modes: Arcade, Ninja and P2 (advanced physics)
- Grouping (e.g:  you can create a group of Aliens and then for movement you move the Group itself, not alien by alien)
- Easy to use animation/sprite engine 
- Easy to use camera engine
- Demoscenes
- Great preloader (one line of code for loading sprites, sounds, JSON files into the game)
- Particle engine
- Device scaling feature
- Easy button creation and hook callbacks on click (e.g: 
```javascript 
game.add.button(400, 300, 90, 'volumeon', this.functionOnClick, this, 2, 1, 0)
```
- Easy sound and music engine
- Easy to draw text onscreen 
- Easy to pause the whole engine/core (```game.pause = true```)
- Easy state creation and change (e.g: 
```javascript
game.state.add('Menu', GameState, false); 
game.state.start('Menu'));
```
- Easy collision engine (e.g:  
```javascript
//  We hook the collision event on the Bullet colliding with an Alien (firing collisionHandler function on overlap)
  game.physics.arcade.overlap(this.bullet, this.alien, this.collisionHandler, null, this);
 // We make the bullet and the alien disappear easily on collision
   function collisionHandler(this.bullets, this.aliens) { 
    this.bullet.kill(); 
    this.aliens.kill();
 }
 ```
- Pool object engine (reusing objects instead of creating and deleting them, e.g; bullets, more performant)
- Game main loading/drawing/updating every tick functions (in execution order: ``` 
init(), preload(), create(), update()```)
- Easy key mapping engine and fire functions, everytime or just once (e.g: 
```javascript 
game.input.onTap.addOnce(this.executeOnce,this))
```

##CONS:

- Almost no 3D support


##Boilerplate installation instructions:

# Phaser + ES6 + Webpack.
#### A bootstrap project to create games with Phaser + ES6 + Webpack.

## Features
- ESLINT with JavaScript Standard Style configuration
- Next generation of Javascript
- Webpack ready
- Multiple browser testing
- WebFont Loader


# Setup
To use this bootstrap you’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies:

Navigate to the cloned repo’s directory.

Run:

```npm install```

## 3. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.
