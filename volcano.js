if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// 			var t = Date.now();
// 			var fps = 1000/70; // max fps
			
			var mouseX = 0, mouseY = 0,

				windowHalfX = window.innerWidth / 2,
				windowHalfY = window.innerHeight / 2,

				camera, scene, renderer, material, material2

				volcanoes = [];

			init();
			animate();

			function init() {

				var container;

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.set( 0, 50, 250 );

				scene = new THREE.Scene();

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				var //values = [ 0, 10, 7, 3, 4, 2, 8, 1, 0 ],
					points = [
						new THREE.Vector3(   0,   0,   0 ), new THREE.Vector3(  .1, 1.0,   0 ), new THREE.Vector3(  .2,  .7,   0 ),
						new THREE.Vector3(  .3,  .3,   0 ), new THREE.Vector3(  .4,  .4,   0 ), new THREE.Vector3(  .5,  .2,   0 ),
						new THREE.Vector3(  .6,  .8,   0 ), new THREE.Vector3(  .7,  .1,   0 ), new THREE.Vector3(  .8,   0,   0 ),
						new THREE.Vector3(  .9,  .8,   0 ), new THREE.Vector3( 1.0,   0,   0 )
					],
					n_sub = 10,
					spline = new THREE.ClosedSplineCurve3( points ),
					geometry = new THREE.Geometry(),
					geometry2= new THREE.RingGeometry( 1, 1, points.length * n_sub, 1 ),
					colors = [], colors2 = [], colors3 = [],

					maxNb =  points.length * n_sub,
					coeffFullCircle = ((Math.PI*2) / (points.length * n_sub)),
					position, index;

// 					geometry2.vertices[0] = geometry2.vertices[geometry2.vertices.length-1];
// 					geometry2.vertices[0] = geometry2.vertices[geometry2.vertices.length-1];

				for ( var i = 0; i < maxNb; i++ ) {

					index = i / maxNb;
					position = spline.getPoint( index );

					// place around
					position.x = Math.cos( coeffFullCircle * i );
					position.z = Math.sin( coeffFullCircle * i );

					geometry.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z );

//  					geometry2.vertices[ maxNb - i ].x += position.y/2;
//  					geometry2.vertices[ maxNb - i ].y += position.y/2;
 					geometry2.vertices[ maxNb - i ].z = position.y;

					colors[ i ] = new THREE.Color( 0xffffff );
					colors[ i ].setHSL( 0.6, 1.0, Math.max( 0, - position.x / 100 ) + 0.5 );

					colors2[ i ] = new THREE.Color( 0xffffff );
					colors2[ i ].setHSL( 0.99, 1.0, Math.max( 0, - position.y / 100 ) + 0.5 );

				}

				geometry.colors = colors;
				geometry2.colors = colors2;

				material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 2, vertexColors: THREE.VertexColors } );
				material2 = new THREE.MeshBasicMaterial( { color: 0x0078b8, wireframe: false, side: THREE.DoubleSide } );
				material3 = new THREE.MeshPhongMaterial( { color: 0x2194ce, wireframe: false, side: THREE.DoubleSide, shininess: 50 } );

				var scale = 100, d = 0;
				[
// 					{
// 						material: material,
// 						scale: [scale, scale, scale],
// 						position: [-d,0,0],
// 						rotation: [0,0,0],
// 						geometry: geometry,
// 						meshType: "Line"
// 					},
					{
						material: material3,
						scale: [scale, scale, scale],
						position: [-d,0,0],
						rotation: [-Math.PI/2,0,0],
						geometry: geometry2,
						meshType: "Mesh"
					}
				].forEach( function( p, i ) {

					var obj = new THREE[ p.meshType || "Mesh" ]( p.geometry,  p.material );

					["scale", "position", "rotation"].forEach(function set( prop ){
						obj[ prop ].set( p[ prop ][ 0 ], p[ prop ][ 1 ], p[ prop ][ 2 ] );
					});

					scene.add( obj );

					volcanoes[ i ] = obj;

				} );

				var light = new THREE.PointLight( 0xffffff, 1, 0 );
				light.position.set( -100, 100, 0 );
				scene.add( light );
				scene.add( new THREE.PointLightHelper( light, 2 ) );


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
				camera.position.y += ( - mouseY + 100 - camera.position.y ) * .9;

				camera.lookAt( new THREE.Vector3( scene.position.x, scene.position.y + 40, scene.position.z ) );

				volcanoes[0].rotateZ( .0125 );

				stats.update();

				renderer.render( scene, camera );

			}






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