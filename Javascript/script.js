// Carrossel de Continentes
    document.addEventListener('DOMContentLoaded', function () {
      const track = document.getElementById('continentesTrack');
      const btnPrev = document.querySelector('.carrossel-btn.prev');
      const btnNext = document.querySelector('.carrossel-btn.next');

      // Largura de cada item + gap
      const itemWidth = 220; // 200px + 20px de gap

      btnPrev.addEventListener('click', () => {
        track.scrollBy({
          left: -itemWidth,
          behavior: 'smooth'
        });
      });

      btnNext.addEventListener('click', () => {
        track.scrollBy({
          left: itemWidth,
          behavior: 'smooth'
        });
      });

      // Opcional: Scroll com mouse wheel
      track.addEventListener('wheel', (e) => {
        e.preventDefault();
        track.scrollBy({
          left: e.deltaY * 2,
          behavior: 'smooth'
        });
      });
    });
