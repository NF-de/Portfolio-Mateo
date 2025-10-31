const scrollContent = document.querySelector('.scroll-content');
const cards = document.querySelectorAll('.card, .hero-card');

let currentY = 0;
let targetY = 0;

const speed = 0.3;

window.addEventListener('scroll', () => {
  targetY = window.scrollY;
});

function animate() {
  requestAnimationFrame(animate);


  currentY += (targetY - currentY) * speed;

  scrollContent.style.backgroundPosition = `center ${-currentY}px`;

}

animate();
