import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { vertexShader, fragmentShader } from './shader.js'


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000000);

var renderer = new THREE.WebGLRenderer();
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 80;

camera.position.z = -38;
camera.position.y = 14;
var time = 0;
controls.update();

// Instantiate a loader
var loader = new GLTFLoader();
var mixer = null;
var clock = new THREE.Clock();

var light = new THREE.AmbientLight(0x404040);
scene.add(light);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var uniforms = {
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    u_mixRatio: { value: 0.0 },
    u_helmet_texture: { value: null },
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
};
var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader()
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);


var animate = function () {
    requestAnimationFrame(animate);
    time += 0.1;
    uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
    uniforms.iTime.value = time;
    renderer.render(scene, camera);
};

animate();
