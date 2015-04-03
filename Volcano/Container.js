
var Volcano = Volcano || {};


//=================
//  Volcano Container
//=================

Volcano.Container = function( conf ) {

    THREE.Group.call( this );
    this.type = 'Volcano';
	var scope = this;

	conf = conf || {};
	this.waves = [];


    this.createWave = function( conf ) {

        var v = new Volcano.Wave({ values: conf.values, subd: conf.subd, color: conf.color });

        v.translateZ( scope.waves.length * .001 );

        scope.add( v );
        scope.waves.push( v );

    };

    this.update = function( d ) {

//         scope.waves.forEach( function( w, i ){
//            w.scale.setY( Math.abs( Math.cos( Date.now()*(.0005 * w.scale.x ) + i ) ) )
//         });

    };

    function init() {

    }

    init();
}

Volcano.Container.prototype = Object.create( THREE.Group.prototype );
Volcano.Container.prototype.constructor = Volcano.Container;
