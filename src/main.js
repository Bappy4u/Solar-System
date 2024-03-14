import * as THREE from 'three/build/three.module';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';
import mercuryTexture from './img/mercury.jpg';
import venusTexture from './img/venus.jpg';
import earthTexture from './img/earth.jpg';
import marsTexture from './img/mars.jpg';
import jupiterTexture from './img/jupiter.jpg';
import saturnTexture from './img/saturn.jpg';
import saturnRingTexture from './img/saturn ring.png';
import uranusTexture from './img/uranus.jpg';
import uranusRingTexture from './img/uranus ring.png';
import neptuneTexture from './img/neptune.jpg';
import plutoTexture from './img/pluto.jpg';
import circleTexture from './img/circle3.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor('#233143');
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


camera.position.set(-90, 140, 140);
camera.lookAt( 0, 0, 0 );
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.autoRotate = true;


//ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//cube texture

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

const createPlanet = (size, texture, position, ring) =>{

    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    mesh.position.x = position;

    if(ring){
        const ringGeometry = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
        obj.add(ringMesh);
    }
    scene.add(obj);
    return {obj, mesh};
};
const addRing = (innerRadius, outerRadius) => {

    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 200);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(circleTexture),
        side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

    ringMesh.rotation.x = -0.5 * Math.PI;

    scene.add(ringMesh);
};

const mercuryPosition = 30;
const mercury = createPlanet(4.5, mercuryTexture, mercuryPosition);
addRing(mercuryPosition, mercuryPosition-1);

const venusPosition = 46;
const venus = createPlanet(5.8, venusTexture, venusPosition);
venus.obj.rotateY(3);
addRing(venusPosition, venusPosition+1);

const eartchPosition = 64;
const earth = createPlanet(6, earthTexture, eartchPosition);
earth.obj.rotateY(4);
addRing(eartchPosition, eartchPosition+1);

const marsPostion = 80;
const mars = createPlanet(4, marsTexture, marsPostion);
mars.obj.rotateY(2);

addRing(marsPostion, marsPostion+1);

const jupiterPostion = 105;
const jupiter = createPlanet(4, jupiterTexture, jupiterPostion);
jupiter.obj.rotateY(4);
addRing(jupiterPostion, jupiterPostion+1);

const saturnPostion = 130;
const saturn = createPlanet(10, saturnTexture, saturnPostion,{
        innerRadius: 10,
        outerRadius: 20,
        texture: saturnRingTexture
    }
);
saturn.mesh.rotation.x = -0.5 * Math.PI;
saturn.obj.rotateY(5);
addRing(saturnPostion, saturnPostion+1);

const uranusPostion = 165;
const uranus = createPlanet(7, uranusTexture, uranusPostion,{
        innerRadius: 7,
        outerRadius: 12,
        texture: uranusRingTexture
    }
);

addRing(uranusPostion, uranusPostion+1);

const neptunePostion = 195;
const neptune = createPlanet(7, neptuneTexture, neptunePostion);
neptune.obj.rotateY(2);
addRing(neptunePostion, neptunePostion+1);

const plutoPostion = 230;
const pluto = createPlanet(2.8, plutoTexture, plutoPostion);
addRing(plutoPostion, plutoPostion+1);
pluto.obj.rotateY(1);



scene.add(sun);

renderer.render(scene, camera);

const animate = ()=> {
    // self-rotation
    sun.rotateY(0.003);
    mercury.mesh.rotateY(0.001);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.0032);
    neptune.mesh.rotateY(0.004);
    pluto.mesh.rotateY(0.008);

    // rotation pointing sun
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.0002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);
    orbit.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

};

animate();


// responsive script

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})