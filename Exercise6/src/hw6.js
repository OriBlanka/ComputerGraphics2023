// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// This defines the initial distance of the camera, you may ignore this as the camera is expected to be dynamic
camera.applyMatrix4(new THREE.Matrix4().makeTranslation(-5, 3, 110));
camera.lookAt(0, -4, 1)


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// helper function for later on
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function GetCard(cardStrac) {
    const cardSize = new THREE.PlaneGeometry(0.5, 1)
    const cardBackSkeleton = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: cardStrac });
    return new THREE.Mesh(cardSize, cardBackSkeleton);
}

function GetPointsForRoute(routeVector, numberOfPointes) {
    return new THREE.QuadraticBezierCurve3(
        ball.position, routeVector, new THREE.Vector3(0, -3, -4)
    ).getPoints(numberOfPointes);
}

let allCards = new Map();
function createCards(cardsIndexes, cardType, routePoints, route) {
    cardsIndexes.forEach(index => {
        const card = GetCard(cardType);
        const point = routePoints[index]
        card.position.set(point.x, point.y, point.z)
        scene.add(card)
        allCards.set(index, new Card(point, cardType, route, card))
    })
}

function createCardsForRoute(redIndexes, yellowIndexes, routePoints, route) {
    createCards(redIndexes, red_card, routePoints, route)
    createCards(yellowIndexes, yellow_card, routePoints, route)
}

class Card {
    constructor(point, cardType, route, cardObject) {
        this.point = point
        this.cardType = cardType
        this.route = route
        this.cardObject = cardObject
    }
}

// Here we load the cubemap and pitch images, you may change it

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'src/pitch/right.jpg',
  'src/pitch/left.jpg',
  'src/pitch/top.jpg',
  'src/pitch/bottom.jpg',
  'src/pitch/front.jpg',
  'src/pitch/back.jpg',
]);
scene.background = texture;


// TODO: Texture Loading
// We usually do  the texture loading before we start everything else, as it might take processing time
const balltexture = new THREE.TextureLoader().load('src/textures/soccer_ball.jpg');
const redcardtexture = new THREE.TextureLoader().load('textures/red_card.jpg' );
const yellowcardtexture = new THREE.TextureLoader().load('textures/yellow_card.jpg' );


// TODO: Add Lighting
const directionalLightOne = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLightOne );

const directionalLightTwo = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLightTwo );

const ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientlight );

// TODO: Goal
// You should copy-paste the goal from the previous exercise here
const groupGoal = new THREE.Group();

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 14, 20);
const whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
const goalpost = new THREE.Mesh(cylinderGeometry, whiteMaterial);
const goalpostTranslationMatrix = new THREE.Matrix4();
goalpostTranslationMatrix.makeTranslation(-18.75, 0, 5);
goalpost.applyMatrix4(goalpostTranslationMatrix);
groupGoal.add(goalpost);

const secondGoalpost = goalpost.clone();

// Translate the second goalpost  to the right
const secondGoalpostPosition = new THREE.Matrix4();
secondGoalpostPosition.makeTranslation(39.1, 0, 0);
secondGoalpost.applyMatrix4(secondGoalpostPosition);
groupGoal.add(secondGoalpost);

// Create the cylinder for the crossbar
const crossbarGeometry = new THREE.CylinderGeometry(0.5, 0.5, 40, 20);
const crossbar = new THREE.Mesh(crossbarGeometry, whiteMaterial);

// Rotate the crossbar 90 degrees around the z-axis to make it horizontal
const crossbarRotation = new THREE.Matrix4();
crossbarRotation.makeRotationZ(Math.PI / 2);
crossbar.applyMatrix4(crossbarRotation);

// Translate the crossbar to the top of the goalposts
const crossbarPosition = new THREE.Matrix4();
crossbarPosition.makeTranslation(0.75, 7, 5); // halfway between the goalposts and at their top, adjust as necessary
crossbar.applyMatrix4(crossbarPosition);

groupGoal.add(crossbar);

// Create the cylinder for the first back support
const backSupportGeometry = new THREE.CylinderGeometry(0.5, 0.5, 17, 20);
const firstBackSupport = new THREE.Mesh(backSupportGeometry, whiteMaterial);

// Rotate the first back support to make it diagonal
const backSupportRotation = new THREE.Matrix4();
backSupportRotation.makeRotationX(-Math.PI / 4);

// Create a rotation matrix with a 35° angle (converted to radians)
backSupportRotation.makeRotationX(degrees_to_radians(35));
firstBackSupport.applyMatrix4(backSupportRotation);

// Translate the first back support to the right place
const firstBackSupportPosition = new THREE.Matrix4();
firstBackSupportPosition.makeTranslation(20, 0, 0);
firstBackSupport.applyMatrix4(firstBackSupportPosition);

groupGoal.add(firstBackSupport);

// Create, rotate, and translate the second back support in a similar way
const secondBackSupport = firstBackSupport.clone();

const secondBackSupportPosition = new THREE.Matrix4();
secondBackSupportPosition.makeTranslation(-38.75, 0, 0);
secondBackSupport.applyMatrix4(secondBackSupportPosition);

groupGoal.add(secondBackSupport);

// Support rings creating
const rings = new THREE.CircleGeometry(1, 60);
const ring1 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring1);
ring1.rotateX(-Math.PI / 2)
ring1.applyMatrix4(new THREE.Matrix4().makeTranslation(12, -4, 0));

const ring2 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring2);
ring2.rotateX(-Math.PI / 2)
ring2.applyMatrix4(new THREE.Matrix4().makeTranslation(-18.75, -4, 0));

const ring3 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring3);
ring3.rotateX(-Math.PI / 2)
ring3.applyMatrix4(new THREE.Matrix4().makeTranslation(-18.75, -4, 5));

const ring4 = new THREE.Mesh(rings, whiteMaterial);
groupGoal.add(ring4);
ring4.rotateX(-Math.PI / 2)
ring4.applyMatrix4(new THREE.Matrix4().makeTranslation(12, -4, 5));

// Nets creating
const indices = [0, 1, 2]
const vertices = [
    -2, -2, 0,
    6, -2, 0,
    -2, 6, 0];

const netBackSkeleton = new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide, transparent: true, opacity: 0.5});
const netBack = new THREE.Mesh(new THREE.PlaneGeometry(40, 17), netBackSkeleton);
groupGoal.add(netBack);
netBack.rotateX((Math.PI / 5))

netBack.applyMatrix4(new THREE.Matrix4().makeTranslation(.7, 0, -.1))

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

// TODO: Ball
// You should add the ball with the soccer.jpg texture here
const ballGeometry = new THREE.SphereGeometry(1, 40, 40);
const ballMaterial = new THREE.MeshPhongMaterial( { map:balltexture, side: THREE.DoubleSide } );
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 100)
scene.add(ball);

// TODO: Bezier Curves
/////////////////////// CURVE 1 /////////////////////////////////
const curve1 = new THREE.QuadraticBezierCurve3(
    ball.position,
    new THREE.Vector3(0,5,40),
    new THREE.Vector3(100,5,100)
);

const pointsCurve1 = curve1.getPoints( 3000 );
const curve1Geometry = new THREE.BufferGeometry().setFromPoints( pointsCurve1 );

const curveMaterial = new THREE.LineBasicMaterial( {transparent: true, opacity: 0.0} );

// Create the final object to add to the scene
const curve1Object = new THREE.Line( curve1Geometry, curveMaterial );
scene.add( curve1Object );

/////////////////////// CURVE 2 /////////////////////////////////

const curve2 = new THREE.QuadraticBezierCurve3(
    ball.position,
    new THREE.Vector3(50,0,50),
    new THREE.Vector3(100,5,100)
);

const pointsCurve2 = curve2.getPoints( 3000 );
const curve2Geometry = new THREE.BufferGeometry().setFromPoints( pointsCurve2 );

// Create the final object to add to the scene
const curve2Object = new THREE.Line( curve2Geometry, curveMaterial );
scene.add( curve2Object );

/////////////////////// CURVE 3 /////////////////////////////////

const curve3 = new THREE.QuadraticBezierCurve3(
    ball.position,
    new THREE.Vector3(70,-5,70),
    new THREE.Vector3(100,5,100)
);

const pointsCurve3 = curve3.getPoints( 3000 );
const curve3Geometry = new THREE.BufferGeometry().setFromPoints( pointsCurve3 );

// Create the final object to add to the scene
const curve3Object = new THREE.Line( curve3Geometry, curveMaterial );
scene.add( curve3Object );

// TODO: Camera Settings
// Set the camera following the ball here
// const cameraTranslate = new THREE.Matrix4();
// cameraTranslate.makeTranslation(0, 4, -20);
// camera.applyMatrix4(cameraTranslate)
camera.rotateX(THREE.MathUtils.degToRad(-15))

// camera.applyMatrix4((new THREE.Matrix4().makeTranslation(0,40,100)));
// camera.applyMatrix4((new THREE.Matrix4().makeRotationX(degrees_to_radians(120))));
// camera.applyMatrix4((new THREE.Matrix4().makeRotationZ(degrees_to_radians(-85))));
camera.applyMatrix4((new THREE.Matrix4().makeRotationY(degrees_to_radians(0))));

// TODO: Add collectible cards with textures
// const redcardmatirial = new THREE.MeshPhongMatirel( { map:redcardtexture } );
// const yellowcardmatirial = new THREE.MeshPhongMatirel( { map:yellowcardtexture } );




// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
	if(e.code == 'ArrowLeft'){
		// TODO
	} else if (e.code == 'ArrowRight'){
		// TODO
	}
}
document.addEventListener('keydown', handle_keydown);



function animate() {

	requestAnimationFrame( animate );

	// TODO: Animation for the ball's position


	// TODO: Test for card-ball collision


	renderer.render( scene, camera );

}
animate()