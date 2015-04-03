

//=================
//  WaveGeometry
//=================

Volcano.Wave = function(conf) {

    THREE.Group.call(this);
    this.type = 'Wave';
    var scope = this;

    conf = conf || {};

    this.color = conf.color;
    this.subd = conf.subd || 10;
    this.radius = conf.radius || 1;
    this.values = conf.values;

    this.points = null;
    this.curve = null;
    this.surface = null;

    function init() {

        initObjects();

//         scope.add(new THREE.Mesh(
//         	new THREE.BoxGeometry(1,1,1),
//         	new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.BackSide})
//         ));

        scope.scale.set(scope.radius, 1, scope.radius);
        scope.translateY(.51);

    }

    function createMaterials(color) {

        var mats = [];

        mats.push( new THREE.PointCloudMaterial({
           size: 2,
           vertexColors: THREE.VertexColors
        }) );

        mats.push( new THREE.LineBasicMaterial({
            opacity: .7,
            linewidth: 2,
            vertexColors: THREE.VertexColors
        }) );

        mats.push( new THREE.MeshPhongMaterial({
            color: scope.color,
            ambient: scope.color,
            side: THREE.DoubleSide,
            transparent: true,opacity: .6,
            wrapAround: true,
            shininess: 1,metal: true
        }) );

        return mats;
    }

    function initObjects() {

        var mats = createMaterials( scope.color );

        // create geometries so updateObjects() can work
        scope.points = { geometry:  new THREE.Geometry() };
        scope.curve = { geometry:   new THREE.Geometry() };
        scope.surface = { geometry: new THREE.PlaneGeometry( .5, 1, scope.values.length * scope.subd, 1 ) };

        // init geometries
        updateObjects( scope.values );

        // create meshes
        scope.points = new THREE.PointCloud( scope.points.geometry, mats[0] ),
        scope.curve = new THREE.Line( scope.curve.geometry, mats[1] ),
        scope.surface = new THREE.Mesh( scope.surface.geometry, mats[2] );

        scope.surface.rotation.set( 0, Math.PI / 2, 0 );

        scope.add( scope.points );
        scope.add( scope.curve );
        scope.add( scope.surface );
    }

    function updateObjects( values ) {

      var geoPoints = scope.points.geometry,
          geoCurve = scope.curve.geometry,
          geoSurface = scope.surface.geometry;

      var spline = new THREE.ClosedSplineCurve3( scope.values ),
          maxNb = values.length * scope.subd,
          colPoints = new Array(scope.values.length), colCurve = new Array(maxNb),
          coeffFullCircle = ((Math.PI * 2) / (scope.values.length * scope.subd)),
          coeff = 0, position = 0, index = 0;

      for (var i = 0; i < maxNb + 1; i++) {

          index = i / maxNb;
          position = spline.getPoint(index);
          coeff = coeffFullCircle * i;

          position.y = Math.max(0, position.y);
          position.x = Math.cos(coeff) * (1 - (position.y * .1));
          position.z = Math.sin(coeff) * (1 - (position.y * .1));

          // points
          if ( (i % scope.subd) == 0) {
              geoPoints.vertices[~~(i / scope.subd)] = new THREE.Vector3(position.x, position.y +.25, position.z);
              colPoints[~~(i / scope.subd)] = new THREE.Color(scope.color);
          }

          // curve
          geoCurve.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
          colCurve[i] = new THREE.Color(scope.color);

          // surface
          geoSurface.vertices[maxNb - i].x = Math.cos(coeff + Math.PI / 2) * (1 - (position.y * .1));
          geoSurface.vertices[maxNb - i].z = Math.sin(coeff + Math.PI / 2) * (1 - (position.y * .1));
          geoSurface.vertices[maxNb - i].y = position.y;
      }

      geoPoints.colors = geoCurve.colors = colCurve;

      scope.surface = new THREE.Mesh(geoSurface, scope.matSurface);

      scope.values = values;

    }





    init();

    this.update = function( t ) {

    };

    this.updateValues = function( values ) {
        updateObjects( values );
    };

    return this;
};

Volcano.Wave.prototype = Object.create(THREE.Group.prototype);
Volcano.Wave.prototype.constructor = Volcano.Wave;
