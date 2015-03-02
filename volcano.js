
var Volcano = {};




//=================
//  WaveGeometry
//=================

Volcano.Wave = function( opt ){

    THREE.Group.call( this );
    this.type = 'Wave';
	var scope = this;

    opt = opt || {};

    this.color = opt.color;

    this.values = opt.values;

    this.nbSubdivisions = opt.nbSubdivisions;

    init( this.values, this.nbSubdivisions, this.color );

    function init( values, nbSubdivisions, color ) {

        var spline = new THREE.ClosedSplineCurve3( values ),
        
            geoCurve = new THREE.Geometry(),
// 			geoSurface = new THREE.RingGeometry( 1, 1, values.length * n_sub, 1, 0, Math.PI*2 ),
            geoSurface = new THREE.CylinderGeometry( .5, 1, 0.001, values.length * nbSubdivisions, 1, true ),

            colors = [],

            maxNb =  values.length * nbSubdivisions,
            coeffFullCircle = ((Math.PI*2) / (values.length * nbSubdivisions)),
            coeff=0, position=0, index=0;

        for ( var i = 0; i < maxNb+1; i++ ) {

            index = i / maxNb;
            position = spline.getPoint( index );
            coeff = coeffFullCircle * i;

            position.y = Math.max( 0, position.y );
            position.x = Math.cos( coeff ) * (1-(position.y*.1));
            position.z = Math.sin( coeff ) * (1-(position.y*.1));

            geoCurve.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z );


            geoSurface.vertices[ maxNb - i ].x = Math.cos( coeff + Math.PI/2 ) * (1-(position.y*.1));
            geoSurface.vertices[ maxNb - i ].z = Math.sin( coeff + Math.PI/2 ) * (1-(position.y*.1));
            geoSurface.vertices[ maxNb - i ].y = position.y;

            colors[ i ] = new THREE.Color( scope.color );
        }

        geoCurve.colors = colors;
        initMaterials( scope.color );
        
        var curve = new THREE.Line( geoCurve, scope.matCurve )
        var surface = new THREE.Mesh( geoSurface, scope.matSurface );

        surface.rotation.set ( 0, Math.PI/2, 0 );

        scope.add( curve );
        scope.add( surface );

    }

    function initMaterials( color ){

        scope.matCurve = new THREE.LineBasicMaterial( {
            color: 0xffffff,
            opacity: 1,
            linewidth: 2,
            vertexColors: THREE.VertexColors
        } );

        scope.matSurface = new THREE.MeshPhongMaterial( {
            color: color, ambient: color,
            side: THREE.DoubleSide,
            transparent: true, opacity: .5,
            wrapAround: true
        } );
    }

    return this;
};

Volcano.Wave.prototype = Object.create( THREE.Group.prototype );
Volcano.Wave.prototype.constructor = Volcano.Wave;




//=================
//  Volcano Container
//=================

Volcano.Container = function( opt ) {

    THREE.Group.call( this );
    this.type = 'Volcano';
	var scope = this;

    init();


    function init() {
        
        dummyValues = (
            function( nb ){ var a = []; for( var x = 0; x<nb; x++ ) { a[ x ] = new THREE.Vector3( Math.random(), Math.random(), 0 ); } return a; }
			)(50);
        createWave( dummyValues, 0x00beff );
    }

    function createWave( values, color ) {

        scope.add( new Volcano.Wave({ values: values, nbSubdivisions: 10, color: color }) );
    }

}

Volcano.Container.prototype = Object.create( THREE.Group.prototype );
Volcano.Container.prototype.constructor = Volcano.Container;