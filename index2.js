if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var time = 0, 
time_now = 0, 
time_delta = 0;

var mouseX = 0, mouseY = 0, _mouseX = 0, _mouseY = 0, cameraLock = !!getMouseLock();

var
windowHalfX = window.innerWidth / 2, 
windowHalfY = window.innerHeight / 2, 

camera, 
scene, renderer, 

plane, plane_wireframe
;

init();
update();

function init() {
    
    var container;
    
    container = document.createElement('div');
    document.body.appendChild(container);
    
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 300;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0009);
    
    renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);



    /**********************
	 *     Plane Ref      *
	 **********************/
    
    var planeRef = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(500, 500), 
    new THREE.MeshBasicMaterial({
        color: 0xeeeeee,
    })
    );
    planeRef.rotateX(-Math.PI / 2);
    scene.add(planeRef);


    /**********************
	 *       Plane        *
	 **********************/
    
    plane = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500, 10, 10), 
    new THREE.MeshBasicMaterial({
        color: 0x77eeff
    })
    );
    plane.translateY(25);
    plane.rotateX(-Math.PI / 2);
    scene.add(plane);
    
    plane_wireframe = plane.clone();
    plane_wireframe.material = new THREE.MeshBasicMaterial({
        color: 0x33bbff,
        wireframe: true
    });
    scene.add(plane_wireframe);



    /**********************
	 *        Light       *
	 **********************/
    
    var lightP0 = new THREE.PointLight(0xffffff, .5, 0);
    lightP0.position.set(-100, 200, 100);
    scene.add(lightP0);
    
    var lightP1 = new THREE.PointLight(0xffffff, 1, 0);
    lightP1.position.set(0, 100, -200);
    scene.add(lightP1);
    
    var lightA = new THREE.AmbientLight(0x202020);
    scene.add(lightA);

    // 	scene.add( new THREE.PointLightHelper( lightP0, 20 ) );
    // 	scene.add( new THREE.PointLightHelper( lightP1, 20 ) );
    // 	scene.add( new THREE.PointLightHelper( lightA, 20 ) );
    
    
    
    var axis = new THREE.AxisHelper(50);
    scene.add(axis);
    
    
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    
    
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);

    //
    
    window.addEventListener('resize', onWindowResize, false);

    var mouseLock = getMouseLock();
    if( mouseLock ) {
        updateCameraFromMouse( mouseX = mouseLock.x, mouseY = mouseLock.y );
    }
}


function moveIt(mesh, time) {

    var coords = mesh.geometry.vertices;

    var y = 0;
    for (var i = 0; i < coords.length; i ++) {
        coords[i].setZ( Math.cos( ~~(i/Math.sqrt(coords.length)) + time*.002 ) *20 );
    }

    mesh.geometry.verticesNeedUpdate = true;
}




/**********************
*        Loop        *
**********************/


function update() {
    
    var time_now = Date.now(), 
    time_delta = time_now - time;
    
    moveIt(plane_wireframe, time_now);

    time = time_now;
    
    var t = new Date(time);
    stats.update({
        t:t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+':'+t.getMilliseconds(),
        Δ:time_delta,
        'm*':~~_mouseX+' : '+~~_mouseY,
        'm ':~~mouseX+' : '+~~mouseY
    });

    if ( !cameraLock && (_mouseX != mouseX || _mouseY != mouseY) ) {
        updateCameraFromMouse( mouseX, mouseY );
    }
    
    render();
    
    requestAnimationFrame(update);
}

function render() {
    
    renderer.render(scene, camera);
}




/***********************
*        Event        *
**********************/

function updateCameraFromMouse( x, y ) {

    camera.position.x += (x - camera.position.x) * .5;
    camera.position.y += (-y + 0 - camera.position.y) * .9 + 200;
    camera.lookAt(new THREE.Vector3());

    _mouseX = x;
    _mouseY = y;
}

function getMouseLock() {
    return ( localStorage.mouseX || localStorage.mouseY ) ? {
        x: localStorage.mouseX+0,
        y: localStorage.mouseY+0
    } : null;
}

function setMouseLock( x, y ) {
    localStorage.mouseX = x;
    localStorage.mouseY = y;
}

//

function onWindowResize() {
    
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onMouseDown(event) {
    cameraLock = false;
}

function onMouseUp(event) {
    cameraLock = true;
    setMouseLock( mouseX, mouseY );
}

function onDocumentTouchStart(event) {
    
    if (event.touches.length > 1) {
        
        event.preventDefault();
        
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    
    if (event.touches.length == 1) {
        
        event.preventDefault();
        
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }

}
