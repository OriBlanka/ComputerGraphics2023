import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 'ForestGreen' );

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// The goalposts.
const goalMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
const postThickness = 0.1;

// Left post.
const leftPostGeometry = new THREE.BoxGeometry(postThickness, 1, postThickness);
const leftPost = new THREE.Mesh(leftPostGeometry, goalMaterial);
leftPost.position.x = -1;
scene.add(leftPost);

// Right post.
const rightPostGeometry = new THREE.BoxGeometry(postThickness, 1, postThickness);
const rightPost = new THREE.Mesh(rightPostGeometry, goalMaterial);
rightPost.position.x = 1;
scene.add(rightPost);

// Crossbar.
const crossbarGeometry = new THREE.BoxGeometry(2 + postThickness, postThickness, postThickness);
const crossbar = new THREE.Mesh(crossbarGeometry, goalMaterial);
crossbar.position.y = 0.5;
scene.add(crossbar);

// The net.
const netGeometry = new THREE.BoxGeometry(2, 1, postThickness);
const netMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.5
});
const net = new THREE.Mesh(netGeometry, netMaterial);
net.position.z = -0.05;
scene.add(net);


// This is a sample box.
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true;

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}

document.addEventListener('keydown',toggleOrbit)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	renderer.render( scene, camera );

}
animate()