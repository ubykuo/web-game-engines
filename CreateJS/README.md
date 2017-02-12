# CreateJS Test - Asteroids

An example of the classic arcade game Asteroids, build using CreateJS's libraries EaselJS, SoundJS and PreloadJS.

### Pros:
* Easy separation of game logic from game objects.
* Well decoupled Graphics, Tweening, Sound and Preloading modules
* You can directly use javascript for html and run (now build steps needed)

### Cons:
* No automatic key mapping support (see Game.html, line 461)
* No default support for collision detection
* No default ES6 support (although can be baked in using Babel or alike)
* It's not specifically a game engine
