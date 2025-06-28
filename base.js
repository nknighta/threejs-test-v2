import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mc = document.getElementById("three-d");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
let based = 3;
const geometry = new THREE.BoxGeometry( based, based, based );
const material = new THREE.MeshBasicMaterial( { color: 0x7856ff } );
;
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

let gamepadIndex = null;
let keys = {}; // Track pressed keys

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

window.addEventListener("gamepadconnected", (event) => {
    gamepadIndex = event.gamepad.index;
    console.log("Gamepad connected:", event.gamepad);
});

window.addEventListener("gamepaddisconnected", () => {
    gamepadIndex = null;
    console.log("Gamepad disconnected");
});

function updateGamepadControls() {
    if (gamepadIndex !== null) {
        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (gamepad) {
            const xAxis = gamepad.axes[0]; // Left stick X-axis
            const yAxis = gamepad.axes[1]; // Left stick Y-axis

            cube.position.x += xAxis * 0.1; // Move cube horizontally
            cube.position.y -= yAxis * 0.1; // Move cube vertically
        }
    }
}

function updateKeyboardControls() {
    const rotationSpeed = 0.02;
    
    // Box rotation with arrow keys
    if (keys['ArrowLeft']) cube.rotation.y -= rotationSpeed;
    if (keys['ArrowRight']) cube.rotation.y += rotationSpeed;
    if (keys['ArrowUp']) cube.rotation.x -= rotationSpeed;
    if (keys['ArrowDown']) cube.rotation.x += rotationSpeed;
    
    // Box rotation with WASD
    if (keys['KeyA']) cube.rotation.y -= rotationSpeed;
    if (keys['KeyD']) cube.rotation.y += rotationSpeed;
    if (keys['KeyW']) cube.rotation.x -= rotationSpeed;
    if (keys['KeyS']) cube.rotation.x += rotationSpeed;
    
    // Z-axis rotation with Q and E
    if (keys['KeyQ']) cube.rotation.z -= rotationSpeed;
    if (keys['KeyE']) cube.rotation.z += rotationSpeed;
}

function animate() {
    updateGamepadControls(); // Update cube position based on gamepad input
    updateKeyboardControls(); // Update cube rotation based on keyboard input

    renderer.render(scene, camera);
}

camera.position.z = 5;
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.update();
scene.add( new THREE.AmbientLight( 0x404040 ) ); // soft white light
scene.add( new THREE.DirectionalLight( 0xffffff, 0.5 ) );
scene.add( new THREE.HemisphereLight( 0xffffff, 0x444444 ) ); // soft light from above
scene.add( new THREE.GridHelper( 100, 100 ) ); // grid for reference
scene.add( new THREE.AxesHelper( 5 ) ); // axes for reference
scene.background = new THREE.Color( 0x000000 ); // set background color
scene.fog = new THREE.FogExp2( 0x000000, 0.01 ); // add fog for depth effect
scene.add( new THREE.PointLight( 0xffffff, 1, 100 ) ); // point light for better lighting
scene.add( new THREE.SpotLight( 0xffffff, 1 ) ); // spotlight for focused lighting

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
mc.appendChild( renderer.domElement );