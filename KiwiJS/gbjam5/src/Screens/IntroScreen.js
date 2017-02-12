"use strict";

GBGJ.IntroScreen = me.ScreenObject.extend({
	init: function() {
		this._super(me.ScreenObject, 'init', []);
	},

	onResetEvent: function() {
		this.radmars = new GBGJ.RadmarsRenderable();
		me.game.world.addChild( new me.ColorLayer("background", GBGJ.black, 0), 0 );
		me.game.world.addChild( this.radmars );

		this.subscription = me.event.subscribe( me.event.KEYDOWN, this.keyHandler.bind(this));

		me.audio.play( "radboy", false );
	},

	keyHandler: function (action, keyCode, edge) {
		if( keyCode === me.input.KEY.ENTER ) {
			me.audio.stop("radboy");
			me.state.change( GBGJ.states.Controls );
		}
	},

	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		me.audio.stopTrack();
		me.event.unsubscribe( this.subscription );
	}
});

GBGJ.RadmarsRenderable = me.Renderable.extend({
	init: function() {
		this._super( me.Renderable, "init", [0, 0, me.video.renderer.getWidth(), me.video.renderer.getHeight()] );
		this.counter = 0;
		this.floating = true;

		var cx = this.width / 2;
		var cy = this.height / 2;
		this.cx = cx;
		this.cy = cy;
		this.bg = new me.Sprite(0, 0, {
			image: "intro_bg",
		});
		this.bg.pos.x = cx;
		this.bg.pos.y = cy;
		var glassesXOffset = me.loader.getImage("intro_glasses1").width / 2;
		var glassesYOffset = me.loader.getImage("intro_glasses1").height / 2

		// Positions are relative to the size of the BG image.
		this.glasses1 = new me.Sprite(cx - glassesXOffset, 0, {image: "intro_glasses1"});
		this.glasses1.anchorPoint.set(0, 0);
		new me.Tween(this.glasses1.pos).to({
			x: cx - glassesXOffset,
			y: cy - glassesYOffset,
		}, 1600).start();

		this.glasses2 = new me.Sprite(cx - glassesXOffset, cy - glassesYOffset, {image: "intro_glasses2"});
		this.glasses3 = new me.Sprite(cx - glassesXOffset, cy - glassesYOffset, {image: "intro_glasses3"});
		this.glasses4 = new me.Sprite(cx - glassesXOffset, cy - glassesYOffset, {image: "intro_glasses4"});
		this.glasses2.anchorPoint.set(0, 0);
		this.glasses3.anchorPoint.set(0, 0);
		this.glasses4.anchorPoint.set(0, 0);

		var textY = cy + 28 - me.loader.getImage("intro_mars").height

		this.text_mars     = new me.Sprite(cx,      textY, {image: "intro_mars"});
		this.text_radmars1 = new me.Sprite(cx - 21, textY, {image: "intro_radmars1"});
		this.text_radmars2 = new me.Sprite(cx - 21, textY, {image: "intro_radmars2"});

		this.text_mars.anchorPoint.set(0, 0);
		this.text_radmars1.anchorPoint.set(0, 0);
		this.text_radmars2.anchorPoint.set(0, 0);
	},

	getMarsText: function() {
		if( this.counter < 130) return this.text_mars;
		else if( this.counter < 135) return this.text_radmars2;
		else if( this.counter < 140) return this.text_radmars1;
		else if( this.counter < 145) return this.text_radmars2;
		else if( this.counter < 150) return this.text_radmars1;
		else if( this.counter < 155) return this.text_radmars2;
		else if( this.counter < 160) return this.text_radmars1;
		else if( this.counter < 165) return this.text_radmars2;
		else return this.text_radmars1;
	},

	getGlasses: function() {
		if( this.counter < 100) return this.glasses1;
		else if( this.counter < 105) return this.glasses2;
		else if( this.counter < 110) return this.glasses3;
		else if( this.counter < 115) return this.glasses4;
		else return this.glasses1;
	},

	draw: function(context) {
		this.bg.draw(context);
		this.getMarsText().draw(context);
		this.getGlasses().draw(context);
	},

	update: function( dt ) {
		if ( this.counter < 350 ) {
			this.counter++;
		}
		else{
			me.state.change(GBGJ.states.Controls);
		}
		// Have to force redraw for the flashing of the shades and text.
		me.game.repaint();
		return true;
	}
});
