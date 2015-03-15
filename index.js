if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var time = 0,
	time_now = 0,
	time_delta = 0;

var mouseX = 0, mouseY = 0,

	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera,
	cameraRTT, rtTexture,
	scene, renderer,

	volcanoes = [];

init();
update();

function init() {

	var container;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 300;

	cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
	cameraRTT.rotation.set( 0,0,0 );
	cameraRTT.position = camera.position;
 	cameraRTT.lookAt(new THREE.Vector3( 0,-1,0 ));

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );




				/**********************
				 *        Texture     *
				 **********************/

// 				var size = 256;
// 				var canvas = document.createElement("canvas");
// 				canvas.width = size;
// 				canvas.height = size;
// 				canvas.style.position = 'absolute';
// 				canvas.style.top = '0px';
// 				canvas.style.left = '128px';
// 				container.appendChild( canvas );

// 				var context = canvas.getContext("2d");

// 				var texture = new TG.Texture( size, size )
// 					.add( new TG.SinY().frequency( 0.002 ).tint( 0, .42, .61 ) )
// 					.add( new TG.Noise().tint( 0, 0.5, 0.5 ) )
// 					.add( new TG.SinY().frequency( 0.0025 ).tint( .2, .62, .81 ) )
// 					.toImageData(context);

// // 					.mul( new TG.SinY().frequency( 0.004 ) )
// // 					.mul( new TG.SinY().offset( 32 ).frequency( 0.02 ) )
// // 					.div( new TG.SinX().frequency( 0.02 ).tint( 8, 5, 4 ) )
// // 					.add( new TG.Noise().tint( 0.1, 0, 0 ) )
// // 					.add( new TG.Noise().tint( 0, 0.1, 0 ) )
// // 					.add( new TG.Noise().tint( 0, 0, 0.1 ) )

// 				context.putImageData( texture, 0, 0 );


	/**********************
	 *        Plane       *
	 **********************/

	rtTexture = new THREE.WebGLRenderTarget( 1024, 1024, { format: THREE.RGBFormat } );

	 var plane = new THREE.Mesh(
	 	new THREE.PlaneBufferGeometry( 1000, 1000 ),
	 	new THREE.MeshBasicMaterial({
	 		color: 0xaaaaaa,
	 		map: rtTexture
	 	})
	);
	plane.rotateX( -Math.PI/2 );
	scene.add( plane );




	/**********************
	 *        Volcano       *
	 **********************/

	var dummyValues = function( nb ){ var a = []; for( var x = 0; x<nb; x++ ) { a[ x ] = new THREE.Vector3( Math.random(), Math.random(), 0 ); } return a; };
	var blue = 0x00beff,
		red = 0xff4965;
	var v0 = new Volcano.Container();
	[   { values: dummyValues(25), color: red, radius: .99, subd: 10 },
		{ values: dummyValues(25), color: red, radius: .95, subd: 10 },
		{ values: dummyValues(25), color: red, radius: .90, subd: 10 },
		{ values: dummyValues(10), color: blue, radius: .4, subd: 5 },
		{ values: dummyValues(10), color: blue, radius: .3, subd: 5 },
		{ values: dummyValues(10), color: blue, radius: .2, subd: 5 }
	].forEach( v0.createWave );

	v0.scale.set( 100, 18, 100 );

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


function update() {

	var time_now = Date.now(),
		time_delta = time_now - time;

	volcanoes.forEach( function( v ){ v.update( time_delta ) } );

	render();

	time = time_now;

	requestAnimationFrame( update );
}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .5;
	camera.position.y += ( - mouseY + 0 - camera.position.y ) * .9 + 200;
	camera.lookAt( new THREE.Vector3( scene.position.x, scene.position.y , scene.position.z ) );

 	cameraRTT.position.set( camera.position.x, -camera.position.y, camera.position.z );
	cameraRTT.lookAt(new THREE.Vector3());

	stats.update();

	renderer.render( scene, cameraRTT, rtTexture, true );
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
