if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var time_last = 0,
	time_delta = 0;

var mouseX = 0, mouseY = 0,

	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera,
	scene, renderer, orbitControls,

	volcanoes = [];

init();
update(Date.now());

orbitControls.position0.set(0,-1,20); orbitControls.target0.set(0,7.5,0); orbitControls.reset();

function init() {

	var container;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 200;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	orbitControls = new THREE.OrbitControls( camera, renderer.domElement );

	/**********************
	 *        Plane       *
	 **********************/

	 var plane = new THREE.Mesh(
	 	new THREE.PlaneBufferGeometry( 1000, 1000 ),
	 	new THREE.MeshBasicMaterial({
	 		color: 0xaaaaaa
	 	})
	);
	plane.rotateX( -Math.PI/2 );
// 	scene.add( plane );




	/**********************
	 *        Volcano       *
	 **********************/

	var dummyValues = function( nb ){ var a = []; for( var x = 0; x<nb; x++ ) { a[ x ] = new THREE.Vector3( Math.random(), Math.random(), 0 ); } return a; };
	var blue = 0x00beff,
		red = 0xff4965;
	var v0 = new Volcano.Container();
	[   { values: dummyValues(25), color: red, radius: .99, subd: 10 },
// 		{ values: dummyValues(25), color: red, radius: .95, subd: 10 },
// 		{ values: dummyValues(25), color: red, radius: .90, subd: 10 },
// 		{ values: dummyValues(10), color: blue, radius: .4, subd: 5 },
// 		{ values: dummyValues(10), color: blue, radius: .3, subd: 5 },
// 		{ values: dummyValues(10), color: blue, radius: .2, subd: 5 }
	].forEach( v0.createWave );

	v0.scale.set( 100, 20, 100 );

	volcanoes.push( v0 );

	scene.add( volcanoes[0] );



	/**********************
	 *        Light       *
	 **********************/

	var lightP0 = new THREE.PointLight( 0xffffff, .5, 0 );
	lightP0.position.set( -100, 200, 100 );
	scene.add( lightP0 );

	var lightP1 = new THREE.PointLight( 0xffffff, 1, 0 );
	lightP1.position.set( 0, 100, -200 );
	scene.add( lightP1 );

	var lightA = new THREE.AmbientLight( 0x202020 );
	scene.add( lightA );

// 	scene.add( new THREE.PointLightHelper( lightP0, 20 ) );
// 	scene.add( new THREE.PointLightHelper( lightP1, 20 ) );
// 	scene.add( new THREE.PointLightHelper( lightA, 20 ) );



	// var axis = new THREE.AxisHelper( 50 );
	// scene.add( axis );


	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);


	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}




/**********************
*        Loop        *
**********************/


function update( time ) {

	var time_delta = time - time_last;

	volcanoes.forEach( function( v ){ v.update( time_delta ) } );

	orbitControls.update();

	render( new Date(time), time_delta );

	time_last = time;

	requestAnimationFrame( update );
}

function render( time, delta ) {

    stats.update({
        t:		time.getMinutes()+':'+time.getSeconds()+':'+time.getMilliseconds(),
        Δ:		time_delta,
        m:	~~mouseX+' : '+~~mouseY
    });

	renderer.render( scene, camera );
}





/***********************
*        Event        *
**********************/


function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}

}
