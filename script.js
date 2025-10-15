// --- Scene, camera et renderer ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Texture de fond ---
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('Images/sable_noir.jpg');

// --- Fond statique ---
function getPlaneSizeAtZ(z) {
    const vFOV = camera.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFOV / 2) * (camera.position.z - z);
    const width = height * camera.aspect;
    return { width, height };
}

let size = getPlaneSizeAtZ(0);
const bgGeometry = new THREE.PlaneGeometry(size.width, size.height);
const bgMaterial = new THREE.MeshBasicMaterial({map: backgroundTexture});
const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgPlane);

// --- Plan central fixe avec texture animée ---
const centralTexture = textureLoader.load('Images/sable_noir.jpg'); 
centralTexture.wrapS = THREE.RepeatWrapping;
centralTexture.wrapT = THREE.RepeatWrapping;
centralTexture.repeat.set(1, 1); // on utilise toute l'image

const centralWidth = 0.7 * size.width;
const centralGeometry = new THREE.PlaneGeometry(centralWidth, size.height); // hauteur inchangée
const centralMaterial = new THREE.MeshBasicMaterial({map: centralTexture});
const centralPlane = new THREE.Mesh(centralGeometry, centralMaterial);
scene.add(centralPlane);

// --- Scroll animation de la texture ---
let targetOffset = 0;
let currentOffset = 0;
const speed = 0.1;

window.addEventListener('scroll', () => {
    const scrollFactor = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    targetOffset = scrollFactor; // l'image entière peut défiler
});

function animate() {
    requestAnimationFrame(animate);

    currentOffset += (targetOffset - currentOffset) * speed;
    centralPlane.material.map.offset.y = -currentOffset;

    renderer.render(scene, camera);
}

animate();

// --- Redimensionnement ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    size = getPlaneSizeAtZ(0);
    bgPlane.geometry.dispose();
    bgPlane.geometry = new THREE.PlaneGeometry(size.width, size.height);

    centralPlane.geometry.dispose();
    centralPlane.geometry = new THREE.PlaneGeometry(0.7 * size.width, size.height); // hauteur inchangée
});
