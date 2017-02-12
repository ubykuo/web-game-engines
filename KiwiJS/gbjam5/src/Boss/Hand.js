"use strict";

GBGJ.HandBoss = GBGJ.Boss.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = 'handboss';
		settings.width = 48;
		settings.height = 75;
		settings.shapes = [ new me.Rect(0, 0, 25, 55)];

		this.states = {
			shoot: {
				delay: 1000,
				next: "moveUp",
			},
			moveUp: {
				delay: 1200,
				next: "shootUp",
			},
			shootUp: {
				delay: 1000,
				next: "down",
			},
			down: {
				delay: 1200,
				next: "slide",
			},
			slide: {
				delay: 1000,
				next: "flip",
			},
			flip: {
				delay: 500,
				next: "shoot",
			}
		};
		
		this.hp = 65;

		this._super(GBGJ.Boss, 'init', [x, y, settings]);
		this.renderable.addAnimation("idle", [0, 1, 2, 3]);
		this.renderable.addAnimation("hit", [0, 4, 0, 4]);
		this.renderable.addAnimation("die", [0, 4]);
		this.changeAnimation("idle");
		this.state = this.states.flip;
		this.currentTimer = 0;
		this.flipped = false;
		
		this.baseX = this.pos.x;
		this.baseY = this.pos.y;
	},

	
	shootUp: function() {
		var angle = 0;
		var dir = new me.Vector2d(this.flipped ? 1 : -1, 0.25);
		for( var i = 0 ; i < 6; i ++ ) {
			me.game.world.addChild(
				new GBGJ.BulletShooter(this.pos.x + i * 5, this.pos.y + (i * 10 - 5), {
					speed: 1,
					dir: dir,
				})
			);
		}
		me.audio.play("enemyshoot");
	},
	
	moveUp: function() {
		var tween = new me.Tween(this.pos).to({
			y: this.baseY - 50,
		}, 800)
			//.onComplete(myFunc);
		//tween.easing(me.Tween.Easing.Quad.Out);
		tween.start();
	},
	
	down: function() {
		var tween = new me.Tween(this.pos).to({
			y: this.baseY,
		}, 800)
			//.onComplete(myFunc);
		//tween.easing(me.Tween.Easing.Quad.Out);
		tween.start();
	},
	

	shoot: function() {
		var angle = 0;
		var dir = new me.Vector2d(this.flipped ? 1 : -1, -0.25);
		for( var i = 0 ; i < 6; i ++ ) {
			me.game.world.addChild(
				new GBGJ.BulletShooter(this.pos.x + i * 5, this.pos.y + (i * 10 - 5), {
					speed: 1,
					dir: dir,
				})
			);
		}
		me.audio.play("enemyshoot");
	},

	slide: function() {
		var tween = new me.Tween(this.pos).to({
			x: this.pos.x + (this.flipped ? 1 : -1) * 120,
		}, 1500)
			//.onComplete(myFunc);
		tween.easing(me.Tween.Easing.Bounce.Out);
		tween.start();
	},

	flip: function() {
		this.flipped = !this.flipped;
		this.renderable.flipX(this.flipped);
	},

	bossUpdate: function(dt) {
		this.currentTimer += dt;
		if(this.currentTimer > this.state.delay) {
			var next = this.state.next
			this[next]();
			this.state = this.states[next];
			this.currentTimer = 0;
		}
	},

	getDeathSound: function() {
		return "boss1death";
	}
});
