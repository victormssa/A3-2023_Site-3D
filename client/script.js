// Importando bibliotecas necessárias do Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Importando as texturas
import gold_ambientOcclusion from './imgs/gold paper_ambientOcclusion.jpeg';
import gold_baseColor from './imgs/gold paper_baseColor.jpeg';
import gold_glossiness from './imgs/gold paper_glossiness.jpeg';
import gold_height from './imgs/gold paper_height.jpeg';
import gold_metallic from './imgs/gold paper_metallic.jpeg';
import gold_normal from './imgs/gold paper_normal.jpeg';
import gold_roughness from './imgs/gold paper_roughness.jpeg';
import gold_specular from './imgs/gold paper_specular.jpeg';
import gold_specularLevel from './imgs/gold paper_specularLevel.jpeg';
import envMap from './imgs/environment_map.jpg'; 

/// Função para carregar texturas
const loadTexture = (path) => new THREE.TextureLoader().load(path);

// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Configuração das texturas
const goldTextures = {
  ambientOcclusionMap: loadTexture(gold_ambientOcclusion),
  baseColorMap: loadTexture(gold_baseColor),
  glossinessMap: loadTexture(gold_glossiness),
  heightMap: loadTexture(gold_height),
  metallicMap: loadTexture(gold_metallic),
  normalMap: loadTexture(gold_normal),
  roughnessMap: loadTexture(gold_roughness),
  specularMap: loadTexture(gold_specular),
  specularLevelMap: loadTexture(gold_specularLevel),
};

// Configuração do ambiente
const envTexture = loadTexture(envMap);
envTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = envTexture;

// Função para criar uma esfera com material e texturas
const createSphere = () => {
  const geometry = new THREE.SphereGeometry(2, 512, 512);

  // Material usando as texturas
  const material = new THREE.MeshStandardMaterial({
    map: goldTextures.baseColorMap,
    aoMap: goldTextures.ambientOcclusionMap,
    displacementMap: goldTextures.heightMap,
    displacementScale: 0.05, 
    metalnessMap: goldTextures.metallicMap,
    normalMap: goldTextures.normalMap,
    roughnessMap: goldTextures.roughnessMap,
    emissiveMap: goldTextures.specularMap,
    specularMap: goldTextures.specularMap,
    specularLevelMap: goldTextures.specularLevelMap,
    envMap: envTexture,
    envMapIntensity: 0.6, 
    metalness: 1.0, 
    roughness: 0.8, 
    aoMapIntensity: 1, 
    displacementBias: 0, 
  });

  // Configuração da repetição das texturas
  Object.values(goldTextures).forEach(texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3); 
  });

  const sphere = new THREE.Mesh(geometry, material);

  // Configuração da GUI
  const gui = new dat.GUI();
  
  Object.keys(goldTextures).forEach(textureName => {
    const texture = goldTextures[textureName];
    const textureFolder = gui.addFolder(textureName);

    textureFolder.add(texture.repeat, 'x', 1, 10).name(`${textureName} X`);
    textureFolder.add(texture.repeat, 'y', 1, 10).name(`${textureName} Y`);
  });

  gui.add(material, 'metalness', 0, 2).name('Metalness');
  gui.add(material, 'roughness', 0, 4).name('Roughness');
  gui.add(material, 'displacementScale', 0, 10).name('Displacement Scale');
  gui.add(material, 'envMapIntensity', 0, 2).name('Env Map Intensity');

  return sphere;
};
// Criação e adição da esfera à cena
const sphere = createSphere();
scene.add(sphere);

// Configuração dos controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Configuração da luz direcional
const directionalLight = new THREE.DirectionalLight(0xeeee99);
directionalLight.position.set(0, 20, 10);
scene.add(directionalLight);

// Configuração da luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);

// Função de animação
const animate = () => {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.00;
  sphere.rotation.y += 0.00;
  controls.update();
  renderer.render(scene, camera);
};

// Chama a função de animação
animate();