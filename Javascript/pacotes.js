document.addEventListener('DOMContentLoaded', () => {
  const carrossel = document.getElementById('carrossel');
  const grid = document.getElementById('promoGrid');
  const cards = document.querySelectorAll('.promo-card');
  const prevBtn = carrossel.querySelector('.prev');
  const nextBtn = carrossel.querySelector('.next');

  if (!cards.length) return;

  const gap = parseFloat(getComputedStyle(grid).gap);
  const cardWidth = cards[0].offsetWidth + gap;
  const totalCards = cards.length;

  let currentIndex = 0;

  function updatePosition() {
    const newPosition = -currentIndex * cardWidth;
    grid.style.transform = `translateX(${newPosition}px)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalCards;
    updatePosition();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updatePosition();
  });

  updatePosition();
});