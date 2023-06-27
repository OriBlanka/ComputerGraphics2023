// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// This defines the initial distance of the camera, you may ignore this as the camera is expected to be dynamic
camera.applyMatrix4(new THREE.Matrix4().makeTranslation(-5, 3, 110));
camera.lookAt(0, -4, 1)


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// helper function for later on
function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function GetCard(cardStrac) {
    const cardGeometry = new THREE.PlaneGeometry(0.5, 1)
    const cardMaterial = new THREE.MeshPhongMaterial({map: cardStrac, side: THREE.DoubleSide});
    return new THREE.Mesh(cardGeometry, cardMaterial);
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
    createCards(redIndexes, redcardtexture, routePoints, route)
    createCards(yellowIndexes, yellowcardtexture, routePoints, route)
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
const redcardtexture = new THREE.TextureLoader().load('src/textures/red_card.jpg');
const yellowcardtexture = new THREE.TextureLoader().load('src/textures/yellow_card.jpg');


// TODO: Add Lighting
const directionalLightOne = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLightOne);

const directionalLightTwo = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLightTwo);

const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientlight);

// TODO: Goal
// You should copy-paste the goal from the previous exercise here
const groupGoal = new THREE.Group();

const cylinderGeometryF = new THREE.CylinderGeometry(0.5, 0.5, 14, 20);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 19, 20);
const cylinderGeometryT = new THREE.CylinderGeometry(0.5, 0.5, 30, 20);
const cylinderMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});

// Create net's left side
const leftGoalPost = new THREE.Mesh(cylinderGeometryF, cylinderMaterial);
const leftGoalPostB = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
leftGoalPost.applyMatrix4(new THREE.Matrix4().makeTranslation(15, 0, 7));
leftGoalPostB.applyMatrix4(new THREE.Matrix4().makeTranslation(15, 0, 0));
leftGoalPostB.rotateX(Math.PI / 4);

groupGoal.add(leftGoalPost);
groupGoal.add(leftGoalPostB);

// Create net's right side
const rightGoalPost = new THREE.Mesh(cylinderGeometryF, cylinderMaterial);
const rightGoalPostB = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
rightGoalPost.applyMatrix4(new THREE.Matrix4().makeTranslation(-15, 0, 7));
rightGoalPostB.applyMatrix4(new THREE.Matrix4().makeTranslation(-15, 0, 0));
rightGoalPostB.rotateX(Math.PI / 4);

groupGoal.add(rightGoalPost);
groupGoal.add(rightGoalPostB);

// Create net's top side
const topGoalPost = new THREE.Mesh(cylinderGeometryT, cylinderMaterial);
topGoalPost.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 7, 7));

topGoalPost.rotateZ(-Math.PI / 2);
groupGoal.add(topGoalPost);

// Support rings creating
const rings = new THREE.CircleGeometry(1, 60);
const ring1 = new THREE.Mesh(rings, cylinderMaterial);
groupGoal.add(ring1);
ring1.rotateX(-Math.PI / 2)
ring1.applyMatrix4(new THREE.Matrix4().makeTranslation(15, -7, 7));

const ring2 = new THREE.Mesh(rings, cylinderMaterial);
groupGoal.add(ring2);
ring2.rotateX(-Math.PI / 2)
ring2.applyMatrix4(new THREE.Matrix4().makeTranslation(-15, -7, 7));

const ring3 = new THREE.Mesh(rings, cylinderMaterial);
groupGoal.add(ring3);
ring3.rotateX(-Math.PI / 2)
ring3.applyMatrix4(new THREE.Matrix4().makeTranslation(-15, -7, -6.5));

const ring4 = new THREE.Mesh(rings, cylinderMaterial);
groupGoal.add(ring4);
ring4.rotateX(-Math.PI / 2)
ring4.applyMatrix4(new THREE.Matrix4().makeTranslation(15, -7, -6.5));

// Nets creating
const indices = [0, 1, 2]
const vertices = [
    2, -4, 0,
    -12, -4, 0,
    2, 10, 0];

const netBackSkeleton = new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide, transparent: true, opacity: 0.7});
const netBack = new THREE.Mesh(new THREE.PlaneGeometry(31, 19), netBackSkeleton);
netBack.rotateX(Math.PI / 4)
groupGoal.add(netBack);

const rightNetGeometry = new THREE.BufferGeometry()
rightNetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
rightNetGeometry.setIndex(indices)
rightNetGeometry.computeVertexNormals()
const netLeft = new THREE.Mesh(rightNetGeometry, netBackSkeleton);
netLeft.rotateY(-Math.PI / 2)
netLeft.applyMatrix4(new THREE.Matrix4().makeTranslation(-15, -3, 5))
groupGoal.add(netLeft)

const leftNetGeometry = new THREE.BufferGeometry()
leftNetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
leftNetGeometry.setIndex(indices);
leftNetGeometry.computeVertexNormals()
leftNetGeometry.computeVertexNormals()
const netRight = new THREE.Mesh(leftNetGeometry, netBackSkeleton);
netRight.rotateY(-Math.PI / 2)
netRight.applyMatrix4(new THREE.Matrix4().makeTranslation(15, -3, 5))
groupGoal.add(netRight)

scene.add(groupGoal);

// TODO: Ball
// You should add the ball with the soccer.jpg texture here
const ballGeometry = new THREE.SphereGeometry(1, 40, 40);
const ballMaterial = new THREE.MeshPhongMaterial({map: balltexture, side: THREE.DoubleSide});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 100)
scene.add(ball);

// TODO: Bezier Curves
const numberOfPointes = 5000; // Number of points to generate
const pointsRight = GetPointsForRoute(new THREE.Vector3(50, 0, 50), numberOfPointes);
const pointsLeftenter = GetPointsForRoute(new THREE.Vector3(0, 50, 50), numberOfPointes);
const pointsLeft = GetPointsForRoute(new THREE.Vector3(-50, 0, 50), numberOfPointes);
const routes_list = [pointsRight, pointsLeftenter, pointsLeft]

// TODO: Camera Settings
// Set the camera following the ball here
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(-2, 8, 10);
camera.applyMatrix4(cameraTranslate)
camera.rotateX(THREE.MathUtils.degToRad(-15))

// TODO: I write this line in order to test objects' locations
camera.applyMatrix4((new THREE.Matrix4().makeRotationY(degrees_to_radians(0))));

// TODO: Add collectible cards with textures
// TODO: Cards hasn't color - Needs to be fixed!
const card = GetCard(yellowcardtexture);
console.log(card);
card.position.set(4, 20, 75);
console.log(card);
const routeACardsRed = [600, 1800, 950]
const routeACardsYellow = [3820, 2950]
createCardsForRoute(routeACardsRed, routeACardsYellow, pointsRight, 0)
const routeBCardsRed = [2800, 3600]
const routeBCardsYellow = [825, 1100]
createCardsForRoute(routeBCardsRed, routeBCardsYellow, pointsLeftenter, 1)
const routeCCardsRed = [425, 1900, 4500]
const routeCCardsYellow = [1000, 3200]
createCardsForRoute(routeCCardsRed, routeCCardsYellow, pointsLeft, 2)


// TODO: Add keyboard event
// We wrote some of the function for you
let startGame = false
let currentRoute = 1;
let currentIndex = 1;

const handle_keydown = (e) => {
    if (e.code == 'ArrowLeft') {
        currentRoute = (currentRoute + 1) % routes_list.length;
    }

    if (e.code === 'ArrowRight') {
        currentRoute = (currentRoute - 1 + routes_list.length) % routes_list.length;
    }

    if (e.code === 'ArrowUp') {
        startGame = true;
    }
}
document.addEventListener('keydown', handle_keydown);

let redCardCounter = 0;
let yellowCardCounter = 0;

function checkHits() {
    if (allCards.has(currentRoute) && allCards.get(currentRoute).route == currentIndex) {
        const hitCard = allCards.get(currentRoute);
        hitCard.cardObject.visible = false;
        hitCard.cardType == yellowcardtexture ? yellowCardCounter++ : redCardCounter++;
    }
}

function calcScore() {
    const yellow = yellowCardCounter;
    const red = 10 * redCardCounter;
    const totalScore = 100 * 2 ** (-((yellow + red) / 10));

    return totalScore;

}
function animate() {

    requestAnimationFrame(animate);

    // Update ball's position along the current route
    if (currentIndex < numberOfPointes - 1) {
        currentIndex++;
    } else {
        currentIndex = 1;
    }

    const currentPoint = routes_list[currentRoute][currentIndex];
    ball.position.copy(currentPoint);

    // Rotate ball around itself
    ball.rotation.x += 0.025;

    renderer.render(scene, camera);

}

animate()