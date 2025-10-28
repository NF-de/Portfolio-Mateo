const scrollContent = document.querySelector('.scroll-content');
const cards = document.querySelectorAll('.card'); // toutes les cartes

let currentY = 0;
let targetY = 0;

const speed = 0.3;

window.addEventListener('scroll', () => {
  targetY = window.scrollY;
});

function animate() {
  requestAnimationFrame(animate);

  // Lissage du scroll
  currentY += (targetY - currentY) * speed;

  // Néon
  scrollContent.style.backgroundPosition = `center ${-currentY}px`;

  // Cartes : même mouvement que le néon
  cards.forEach((card, index) => {
    let offset = 0;

    // Décalage vertical initial selon la position (zigzag)
    if(index === 0) offset = -50; // première carte à gauche
    else if(index === 1) offset = 50; // deuxième carte à droite
    else offset = 0; // cartes suivantes au centre

    card.style.transform = `translateY(${offset - currentY}px)`;
  });
}

animate();
