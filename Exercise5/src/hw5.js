import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color('ForestGreen');

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

const groupGoal = new THREE.Group();

const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
const whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
const goalpost = new THREE.Mesh(cylinderGeometry, whiteMaterial);
const goalpostTranslationMatrix = new THREE.Matrix4();
goalpostTranslationMatrix.makeTranslation(-4, 0, 0);
goalpost.applyMatrix4(goalpostTranslationMatrix);
groupGoal.add(goalpost);

const secondGoalpost = goalpost.clone();

// Translate the second goalpost  to the right
const secondGoalpostPosition = new THREE.Matrix4();
secondGoalpostPosition.makeTranslation(8, 0, 0);
secondGoalpost.applyMatrix4(secondGoalpostPosition);
groupGoal.add(secondGoalpost);

// Create the cylinder for the crossbar
const crossbarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8, 35);
const crossbar = new THREE.Mesh(crossbarGeometry, whiteMaterial);

// Rotate the crossbar 90 degrees around the z-axis to make it horizontal
const crossbarRotation = new THREE.Matrix4();
crossbarRotation.makeRotationZ(Math.PI / 2);
crossbar.applyMatrix4(crossbarRotation);

// Translate the crossbar to the top of the goalposts
const crossbarPosition = new THREE.Matrix4();
crossbarPosition.makeTranslation(0, 1, 0); // halfway between the goalposts and at their top, adjust as necessary
crossbar.applyMatrix4(crossbarPosition);

groupGoal.add(crossbar);

// Create the cylinder for the first back support
const backSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 32);
const firstBackSupport = new THREE.Mesh(backSupportGeometry, whiteMaterial);

// Rotate the first back support to make it diagonal
const backSupportRotation = new THREE.Matrix4();
backSupportRotation.makeRotationX(Math.PI / 2);

// Create a rotation matrix with a 35° angle (converted to radians)
backSupportRotation.makeRotationX(degrees_to_radians(35));
firstBackSupport.applyMatrix4(backSupportRotation);

// Translate the first back support to the right place
const firstBackSupportPosition = new THREE.Matrix4();
firstBackSupportPosition.makeTranslation(4, 0.025, -.65);
firstBackSupport.applyMatrix4(firstBackSupportPosition);

groupGoal.add(firstBackSupport);

// Create, rotate, and translate the second back support in a similar way
const secondBackSupport = firstBackSupport.clone();

const secondBackSupportPosition = new THREE.Matrix4();
secondBackSupportPosition.makeTranslation(-8, 0, 0);
secondBackSupport.applyMatrix4(secondBackSupportPosition);

groupGoal.add(secondBackSupport);

// Support rings creating
const rings = new THREE.CircleGeometry(0.15, 60);
const ring1 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring1);
ring1.rotateX(-Math.PI / 2)
ring1.applyMatrix4(new THREE.Matrix4().makeTranslation(4, -1, -1.35))

const ring2 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring2);
ring2.rotateX(-Math.PI / 2)
ring2.applyMatrix4(new THREE.Matrix4().makeTranslation(-4, -1, 0))

const ring3 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring3);
ring3.rotateX(-Math.PI / 2)
ring3.applyMatrix4(new THREE.Matrix4().makeTranslation(-4, -1, -1.35))

const ring4 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring4);
ring4.rotateX(-Math.PI / 2)
ring4.applyMatrix4(new THREE.Matrix4().makeTranslation(4, -1, 0))

// Nets creating
const indices = [0, 1, 2]
const vertices = [
    .5, -1, 0,
    -.9, -1, 0,
    .5, 1, 0];

const netBackSkeleton = new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide});
const netBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 2.35), netBackSkeleton);
groupGoal.add(netBack);
netBack.rotateX((Math.PI / 5))

netBack.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -.7))

const leftNetGeometry = new THREE.BufferGeometry()
leftNetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
leftNetGeometry.setIndex(indices)
leftNetGeometry.computeVertexNormals()
const netLeft = new THREE.Mesh(leftNetGeometry, netBackSkeleton);
groupGoal.add(netLeft)
netLeft.rotateY(-Math.PI / 2)

netLeft.applyMatrix4(new THREE.Matrix4().makeTranslation(4, 0, -.5))

const rightNetGeometry = new THREE.BufferGeometry()
rightNetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
rightNetGeometry.setIndex(indices);
rightNetGeometry.computeVertexNormals()
const netRight = new THREE.Mesh(rightNetGeometry, netBackSkeleton);
groupGoal.add(netRight)
rightNetGeometry.rotateY(-Math.PI / 2)
netRight.applyMatrix4(new THREE.Matrix4().makeTranslation(-4, 0, -.5))

scene.add(groupGoal);

// Ball creating
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);

const ballTranslationMatrix = new THREE.Matrix4();
ballTranslationMatrix.makeTranslation(0, 0, 2);
ball.applyMatrix4(ballTranslationMatrix);
scene.add(ball);

const parent = new THREE.Group();
scene.add(parent);
parent.add(ball);

// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 0, 5);
camera.applyMatrix4(cameraTranslate)

let allMatirials = [whiteMaterial, netBackSkeleton, ballMaterial];
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

let isOrbitEnabled = true;
let oneAnimation = false;
let twoAnimation = false;
let thirdAnimation = false;
let rotationSpeed = 10;

const toggleOrbit = (e) => {
    if (e.key == "o") {
        isOrbitEnabled = !isOrbitEnabled;
    }

    if (e.key === "w") {
        allMatirials.map((element) => { element.wireframe = !element.wireframe; });
    }

    if (e.key === "1") {
        oneAnimation = !oneAnimation;
    }

    if (e.key === "2") {
        twoAnimation = !twoAnimation;
    }

    if (e.key === "0") {
        thirdAnimation = !thirdAnimation;
    }

    if (e.key === "+") {
        rotationSpeed = rotationSpeed + 1;
    }

    if (e.key === "-" && rotationSpeed != 1) {
        rotationSpeed = rotationSpeed - 1;
    }

}

document.addEventListener('keydown', toggleOrbit)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

    const orbitRadius = 3
    requestAnimationFrame(animate);

    if (oneAnimation) {
        const time = Date.now() * (rotationSpeed * 0.001) ;
        const x = Math.cos(time) * orbitRadius;
        const z = Math.sin(time) * orbitRadius;
        parent.position.set(0, -x, z);
    }

    if (twoAnimation) {
        const time = Date.now() * (rotationSpeed * 0.001);
        const x = Math.cos(time) * orbitRadius;
        const z = Math.sin(time) * orbitRadius;
        parent.position.set(x, 0, z);
    }

    if (thirdAnimation) {
        const time = Date.now() * (rotationSpeed * 0.001);
        const x = Math.cos(time) * orbitRadius;
        const z = Math.sin(time) * orbitRadius;
        parent.position.set(-z, -x, z);
    }

    controls.enabled = isOrbitEnabled;
    controls.update();

    renderer.render(scene, camera);

}

animate()