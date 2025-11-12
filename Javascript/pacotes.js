document.addEventListener('DOMContentLoaded', () => {
  const carrossel = document.getElementById('carrossel');
  const grid = document.getElementById('promoGrid');
  const cards = document.querySelectorAll('.promo-card');
  const prevBtn = carrossel.querySelector('.prev');
  const nextBtn = carrossel.querySelector('.next');

  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(grid).gap);
  let currentIndex = 0;

  function updatePosition() {
    const newPosition = -currentIndex * cardWidth;
    grid.style.transform = `translateX(${newPosition}px)`;
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updatePosition();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    }
  });
});