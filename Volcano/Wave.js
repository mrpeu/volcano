

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
    this.subd = this.conf.subd = conf.subd || 10;
    this.conf.radius = conf.radius || 1;
    this.angle = this.conf.angle || Math.PI;

    this.points = null;
    this.matPoints = null;

    this.curve = null;
    this.matCurve = null;

    this.surface = null;
    this.matSurface = null;

    init();

    this.update = function(d) {

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
            geoSurface = new THREE.PlaneBufferGeometry(.5, 1, 0.001, scope.values.length * scope.subd, 1, true)
        ;

        updateGeometries( scope.values, scope.angle, geoPoints, geoCurve, geoSurface );

        scope.points = new THREE.PointCloud(geoPoints, scope.matPoints);

        scope.curve = new THREE.Line(geoCurve, scope.matCurve);

        scope.surface = new THREE.Mesh(geoSurface, scope.matSurface);
        scope.surface.rotation.set(0, Math.PI / 2, 0);

        scope.add(scope.points);
        scope.add(scope.curve);
        scope.add(scope.surface);
    }

    function updateGeometries( values, angle, geoPoints, geoCurve, geoSurface ) {
        
        var geoSurfacePosition = geoSurface.attributes.position.array,
            spline = new THREE.ClosedSplineCurve3(scope.values),
            maxNb = scope.values.length * scope.subd,
            coeffFull = ((Math.PI * 2) / (scope.values.length * scope.subd)),
            coeff = 0, position = 0, index = 0
        ;

        for (var i = 0; i < maxNb + 1; i++) {

            index = i / maxNb;
            position = spline.getPoint(index);
            coeff = coeffFull * i;

            position.y = Math.max(0, position.y);
            position.x = Math.cos(coeff) * (1 - (position.y * .1));
            position.z = Math.sin(coeff) * (1 - (position.y * .1));


//             // points
//             if ( (i % scope.subd) == 0) {
//                 geoPoints.vertices[~~(i / scope.subd)] = new THREE.Vector3(position.x, position.y +.25, position.z);
//                 geoPoints.colors[~~(i / scope.subd)] = new THREE.Color(scope.color);
//             }


//             // curve
//             geoCurve.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
//             geoCurve.colors[i] = new THREE.Color(scope.color);


            // surface
            geoSurfacePosition[maxNb - i].x = position.x; //Math.cos(coeff + Math.PI / 2) * (1 - (position.y * .1));
            geoSurfacePosition[maxNb - i].y = position.y;
            geoSurfacePosition[maxNb - i].z = position.z; //Math.sin(coeff + Math.PI / 2) * (1 - (position.y * .1));
        }

    }

    return this;
};

Volcano.Wave.prototype = Object.create(THREE.Group.prototype);
Volcano.Wave.prototype.constructor = Volcano.Wave;
