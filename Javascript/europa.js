document.addEventListener('DOMContentLoaded', () => {
    const secoes = document.querySelectorAll('.secao-carrossel');
 

    secoes.forEach(secao => {
        const track = secao.querySelector('.carrossel-track');
        const prevBtn = secao.querySelector('.prev');
        const nextBtn = secao.querySelector('.next');
        const cards = secao.querySelectorAll('.carousel-item');
       
        if (!track || !prevBtn || !nextBtn || cards.length === 0) return;
 
        let currentIndex = 0;
 
        function updateTrack() {
            const cardWidth = cards[0].offsetWidth;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
 
        function nextSlide() {
            if (currentIndex < (cards.length - 1)) {
                currentIndex++;
                updateTrack();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateTrack();
            }
        }
 
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
 
        // Atualiza ao redimensionar (mantém alinhamento em mobile/desktop)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateTrack, 150);
        });
 
        // Inicializa posição
        updateTrack();
    });
});