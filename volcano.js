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





				var //values = [ 0, 10, 7, 3, 4, 2, 8, 1, 0 ],
					points =
						(function( nb ){ var a = []; for( var x = 0; x<nb; x++ ) { a[ x ] = new THREE.Vector3( Math.random(), Math.random(), 0 ); } return a; }
						)(50),
// 					[
// 						new THREE.Vector3(   0,   0,   0 ), new THREE.Vector3(  .1, 1.0,   0 ), new THREE.Vector3(  .2,  .7,   0 ),
// 						new THREE.Vector3(  .3,  .3,   0 ), new THREE.Vector3(  .4,  .4,   0 ), new THREE.Vector3(  .5,  .2,   0 ),
// 						new THREE.Vector3(  .6,  .8,   0 ), new THREE.Vector3(  .7,  .1,   0 ), new THREE.Vector3(  .8,   0,   0 ),
// 						new THREE.Vector3(  .9,  .8,   0 ), new THREE.Vector3( 1.0,   0,   0 )
// 					],
					n_sub = 10,
					spline = new THREE.ClosedSplineCurve3( points ),
					geoCurve = new THREE.Geometry(),
// 					geoSurface= new THREE.RingGeometry( 1, 1, points.length * n_sub, 1, 0, Math.PI*2 ),
					geoSurface= new THREE.CylinderGeometry( .5, 1, 0.001, points.length * n_sub, 1, true ),
					colors = [], colors2 = [],

					maxNb =  points.length * n_sub,
					coeffFullCircle = ((Math.PI*2) / (points.length * n_sub)),
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


					colors[ i ] = new THREE.Color( 0x00beff );
// 					colors[ i ].setHSL( 0.6, 1.0, Math.max( 0, - position.x / 100 ) + 0.5 );
				}

				geoCurve.colors = colors;

				var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 2, vertexColors: THREE.VertexColors } ),
					material2 = new THREE.MeshBasicMaterial( { color: 0x0078b8, wireframe: false, side: THREE.DoubleSide } ),
// 				material3 = new THREE.MeshPhongMaterial( {
// 					color: 0x2194ce,
// 					wireframe: false,
// 					side: THREE.DoubleSide,
// 					map: new THREE.Texture( canvas ),
// 					transparent: true,
// 					opacity: 0.5
// 				} ),
					material4 = new THREE.MeshPhongMaterial( {
						color: 0x00beff, ambient: 0x00beff,
						side: THREE.DoubleSide,
						transparent: true, opacity: .5,
						wrapAround: true
					} )
				;
// 					material3.map.needsUpdate = true;


				var scale = 100;

				createNewMesh( {
					material: material,
					scale: [scale, scale/5, scale],
					position: [0,0,0],
					rotation: [0,0,0],
					geometry: geoCurve,
					meshType: "Line"
				} );
				createNewMesh( {
					material: material4,
					scale: [scale, scale/5, scale],
					position: [0,0,0],
					rotation: [0,Math.PI/2,0],
					geometry: geoSurface,
					meshType: "Mesh"
				} );
				createNewMesh( {
					material: new THREE.MeshPhongMaterial({ color: 0xa3a3a3, shininess: 40 }),
					scale: [32,32,32],
					position: [0,50,0],
					rotation: [Math.PI/3,Math.PI/3,0],
					geometry: new THREE.BoxGeometry(1,1,1),
					meshType: "Mesh"
				} );

				function createNewMesh( p ) {

					var obj = new THREE[ p.meshType || "Mesh" ]( p.geometry,  p.material );

					["scale", "position", "rotation"].forEach(function set( prop ){
						obj[ prop ].set( p[ prop ][ 0 ], p[ prop ][ 1 ], p[ prop ][ 2 ] );
					});

					scene.add( obj );

					volcanoes.push( obj );
				}



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
				volcanoes[2].rotateY( .0125 );

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