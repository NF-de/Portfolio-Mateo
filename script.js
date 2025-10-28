// --- Scene, camera et renderer ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
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
const bgMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgPlane);

// --- Plan central avec texture qui défile sans répétition ---
const centralTexture = textureLoader.load('Images/sable_noir.jpg', (tex) => {
    // on garde l'aspect naturel sans répétition
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1); // pas de répétition
});

const centralWidth = 0.7 * size.width;
const centralGeometry = new THREE.PlaneGeometry(centralWidth, size.height);
const centralMaterial = new THREE.MeshBasicMaterial({ map: centralTexture });
const centralPlane = new THREE.Mesh(centralGeometry, centralMaterial);
scene.add(centralPlane);

// --- Animation de scroll ---
let targetOffset = 0;
let currentOffset = 0;
const speed = 0.1;

window.addEventListener('scroll', () => {
    // scrollFactor = 0 → haut, 1 → bas
    const scrollFactor = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // on limite l'offset entre 0 et 1-imageHeightRatio
    // ici 1 correspond à la hauteur complète de l'image
    targetOffset = THREE.MathUtils.clamp(scrollFactor, 0, 1);
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    size = getPlaneSizeAtZ(0);
    bgPlane.geometry.dispose();
    bgPlane.geometry = new THREE.PlaneGeometry(size.width, size.height);

    centralPlane.geometry.dispose();
    centralPlane.geometry = new THREE.PlaneGeometry(0.7 * size.width, size.height);
});
