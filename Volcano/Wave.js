

//=================
//  WaveGeometry
//=================

Volcano.Wave = function(conf) {

    THREE.Group.call(this);
    this.type = 'Wave';
    var scope = this;

    this.conf = conf || {};
    this.color = this.conf.color = conf.color;
    this.values = this.conf.values = conf.values;
    this.subd = this.conf.subd = conf.subd || 2;
    this.conf.radius = conf.radius || 1;
    this.angle = this.conf.angle || Math.PI;

    this.points = null;
    this.matPoints = null;

    this.curve = null;
    this.matCurve = null;

    this.surface = null;
    this.surface2 = null;
    this.matSurface = null;

    init();

    this.update = function(d) {

        updateGeometries( scope.values, scope.angle, scope.points.geometry, scope.curve.geometry, scope.surface.geometry );
    }

    function init() {
        initMaterials(scope.color);
        initObjects();
    }

    function initMaterials(color) {

        scope.matPoints = new THREE.PointCloudMaterial({
           size: 2,
           vertexColors: THREE.VertexColors
        });

        scope.matCurve = new THREE.LineBasicMaterial({
            opacity: .7,
            linewidth: 2,
            vertexColors: THREE.VertexColors
        });

        scope.matSurface = new THREE.MeshPhongMaterial({
            color: color,ambient: color,
            side: THREE.DoubleSide,
            transparent: true,opacity: .6,
            wrapAround: true,
            shininess: 1,metal: true
        });
    }

    function initObjects() {

        scope.scale.set(scope.conf.radius, 1, scope.conf.radius);

        var geoPoints = new THREE.Geometry(),
            geoCurve = new THREE.Geometry(),
            geoSurface = new THREE.PlaneBufferGeometry(.5, 1, 1, scope.values.length * scope.subd)
        ;

        updateGeometries( scope.values, scope.angle, geoPoints, geoCurve, geoSurface );

        scope.points = new THREE.PointCloud(geoPoints, scope.matPoints);

        scope.curve = new THREE.Line(geoCurve, scope.matCurve);

        scope.surface = new THREE.Mesh(geoSurface, scope.matSurface);
        scope.surface.translateY( 0.5 );
//         scope.surface.rotation.set(0, 0, Math.PI / 2);

        var colors = [];
        for(var i=0; i<geoSurface.attributes.position.length; i++){
            colors[ i ] = new THREE.Color( 0xffffff );
            colors[ i ].setHSL( 0.6, 1.0, Math.max( 0, ( 200 - i ) / 400 ) * 0.5 + 0.5 );
        }
        geoSurface.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

        var surface2 = new THREE.Mesh( geoSurface, new THREE.MeshBasicMaterial({color:scope.color, wireframe:true, vertexColors: THREE.VertexColors}));
//         surface2.translateY( 0.5 );
        surface2.rotation.set(0, 0, Math.PI / 2);
        scope.add( surface2 );
        scope.surface2 = surface2;

//         scope.add(scope.points);
//         scope.add(scope.curve);
//         scope.add(scope.surface);
    }

    function updateGeometries( values, angle, geoPoints, geoCurve, geoSurface ) {
        
//         var v = geoSurface.attributes.position.array,
//             spline = new THREE.ClosedSplineCurve3(values),
//             maxNb = values.length * scope.subd,
//             coeffFull = ((Math.PI * 2) / (values.length * scope.subd)),
//             coeff = 0, position = 0, index = 0
//         ;

//         for (var i = 0; i < maxNb + 1; i++) {

//             index = i / maxNb;
//             position = spline.getPoint(index);
//             coeff = coeffFull * i;

//             position.y = Math.max(0, position.y);
//             position.x = Math.cos(coeff) * (1 - (position.y * .1));
//             position.z = Math.sin(coeff) * (1 - (position.y * .1));


// //             // points
//             if ( (i % scope.subd) == 0) {
//                 geoPoints.vertices[~~(i / scope.subd)] = new THREE.Vector3(position.x, position.y +.25, position.z);
//                 geoPoints.colors[~~(i / scope.subd)] = new THREE.Color(scope.color);
//             }


// //             // curve
//             geoCurve.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
//             geoCurve.colors[i] = new THREE.Color(scope.color);


//             // surface
// //             v[3*i+0].x = position.x;//Math.cos(coeff + Math.PI / 2) * (1 - (position.y * .1));
// //             v[3*i+1].y = position.y;
// //             v[3*i+2].z = position.z; //Math.sin(coeff + Math.PI / 2) * (1 - (position.y * .1));

//         }

//         geoSurface.attributes.position.needsUpdate = true;

    }




//--------------
// TEST
//--------------

    setTimeout( function(){
        var v = scope.surface2.geometry.attributes.position.array;

        var mat = new THREE.MeshBasicMaterial({color:0x22ff22});
        var geo = new THREE.IcosahedronGeometry(.01,1);

        var len = 10; //v.length/4;
        var off = 5; //v.length/2;

        for( var i = 0; i < len ; i+=3 ){

            var ind = i;
//             var vx = v[ind];

            var x = v[ind + 0 + off],
                y = v[ind + 1 + off],
                z = v[ind + 2 + off];
            
            var ball = new THREE.Mesh( geo.clone(), mat );
            var factor = Math.cos( (Math.PI)*( i/len ) );

            ball.position.set( y, x, z );
            ball.rotation.set(0, 0, Math.PI/2);
            ball.scale.set( factor*.75, factor*.2, factor*.2 );
            
            v[ind + 0 + off] += (Math.random()-.5)*.5;

            scope.add( ball );
//             scope.rotateZ( Math.PI/2 );
        }

        scope.surface2.geometry.attributes.position.needsUpdate = true;

    }, 500);

//--------------
// /TEST
//--------------




    return this;
};

Volcano.Wave.prototype = Object.create(THREE.Group.prototype);
Volcano.Wave.prototype.constructor = Volcano.Wave;
