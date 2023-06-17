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


const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
const whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
const goalpost = new THREE.Mesh(cylinderGeometry, whiteMaterial);
scene.add(goalpost);

// Create the torus at the bottom of the goalpost
const torusGeometry = new THREE.TorusGeometry(0.1, 0.02, 16, 100);
const torus = new THREE.Mesh(torusGeometry, whiteMaterial);

// Rotate the torus 90 degrees around the x-axis to make it orthogonal to the goalpost
const rotationMatrix = new THREE.Matrix4();
rotationMatrix.makeRotationX(Math.PI / 2);
torus.applyMatrix4(rotationMatrix);

// Translate the torus to the bottom of the goalpost
const translationMatrix = new THREE.Matrix4();
translationMatrix.makeTranslation(0, -1, 0);  // assuming the goalpost's height is 2
torus.applyMatrix4(translationMatrix);

scene.add(torus);


const secondGoalpost = goalpost.clone();
const secondTorus = torus.clone();

// Translate the second goalpost and torus to the right
const secondGoalpostPosition = new THREE.Matrix4();
secondGoalpostPosition.makeTranslation(1, 0, 0); // 1 unit to the right, adjust as necessary
secondGoalpost.applyMatrix4(secondGoalpostPosition);
secondTorus.applyMatrix4(secondGoalpostPosition);

scene.add(secondGoalpost);
scene.add(secondTorus);

// Create the cylinder for the crossbar
const crossbarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32); // adjust dimensions as necessary
const crossbar = new THREE.Mesh(crossbarGeometry, whiteMaterial);

// Rotate the crossbar 90 degrees around the z-axis to make it horizontal
const crossbarRotation = new THREE.Matrix4();
crossbarRotation.makeRotationZ(Math.PI / 2);
crossbar.applyMatrix4(crossbarRotation);

// Translate the crossbar to the top of the goalposts
const crossbarPosition = new THREE.Matrix4();
crossbarPosition.makeTranslation(0.5, 1, 0); // halfway between the goalposts and at their top, adjust as necessary
crossbar.applyMatrix4(crossbarPosition);

scene.add(crossbar);

// Create the cylinder for the first back support
const backSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32); // adjust dimensions as necessary
const firstBackSupport = new THREE.Mesh(backSupportGeometry, whiteMaterial);

// Rotate the first back support to make it diagonal
// const backSupportRotation = new THREE.Matrix4();
// backSupportRotation.makeRotationZ(degrees_to_radians(40)); // 40 degrees, adjust as necessary
// backSupportRotation.makeRotationX(degrees_to_radians(40)); // 40 degrees, adjust as necessary
// firstBackSupport.applyMatrix4(backSupportRotation);

// Rotate the first back support to make it diagonal
const backSupportRotation = new THREE.Matrix4();

// Create a rotation matrix with a 35° angle (converted to radians)
backSupportRotation.makeRotationX(degrees_to_radians(35));
firstBackSupport.applyMatrix4(backSupportRotation);


// Translate the first back support to the right place
const firstBackSupportPosition = new THREE.Matrix4();
firstBackSupportPosition.makeTranslation(1, 0.18, -.575); // 1 unit to the right, adjust as necessary
firstBackSupport.applyMatrix4(firstBackSupportPosition);

scene.add(firstBackSupport);

// Create the torus at the bottom of the first back support
const firstBackSupportTorus = new THREE.Mesh(torusGeometry, whiteMaterial);

// Rotate and translate the torus to the right place
firstBackSupportTorus.applyMatrix4(backSupportRotation);
firstBackSupportTorus.applyMatrix4(firstBackSupportPosition);

scene.add(firstBackSupportTorus);

// Create, rotate, and translate the second back support in a similar way
const secondBackSupport = firstBackSupport.clone();
const secondBackSupportTorus = firstBackSupportTorus.clone();

const secondBackSupportPosition = new THREE.Matrix4();
secondBackSupportPosition.makeTranslation(-2, 0, 0); // 2 units to the left, adjust as necessary
secondBackSupport.applyMatrix4(secondBackSupportPosition);
secondBackSupportTorus.applyMatrix4(secondBackSupportPosition);

scene.add(secondBackSupport);
scene.add(secondBackSupportTorus);







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