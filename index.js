if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// 			var t = Date.now();
// 			var fps = 1000/70; // max fps
			
var mouseX = 0, mouseY = 0,

	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera, scene, renderer,

	volcanoes = [];

init();
animate();

function init() {

	var container;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 100, 250 );

	scene = new THREE.Scene();

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


	volcanoes.push( new Volcano.Container() );

	volcanoes[0].scale.set( 100, 20, 100 );

	scene.add( volcanoes[0] );


	/**********************
	 *        Light       *
	 **********************/

	var lightP0 = new THREE.PointLight( 0xffffff, .5, 0 );
	lightP0.position.set( -100, 200, 100 );
	scene.add( lightP0 );
	// scene.add( new THREE.PointLightHelper( lightP0, 5 ) );

	var lightP1 = new THREE.PointLight( 0xffffff, 1, 0 );
	lightP1.position.set( 0, 100, -200 );
	scene.add( lightP1 );
	// scene.add( new THREE.PointLightHelper( lightP1, 5 ) );

	var lightA = new THREE.AmbientLight( 0x202020 );
	scene.add( lightA );



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


function animate() {

	// 				var d = Date.now();
	// 				if( d-t > fps ) {
	// 					t = d;
		render();
	// 				}

	requestAnimationFrame( animate );
}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .5;
	camera.position.y += ( - mouseY + 50 - camera.position.y ) * .9;

	camera.lookAt( new THREE.Vector3( scene.position.x, scene.position.y + 40, scene.position.z ) );

	// 				volcanoes.forEach( function( v ) { v.rotateY( .0125 ); } );
	volcanoes[0].rotateY( .00125 );

	stats.update();

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