const track = document.getElementById('carrosselTrack');
const btnEsquerda = document.querySelector('.carrossel-btn.esquerda');
const btnDireita = document.querySelector('.carrossel-btn.direita');

btnEsquerda.addEventListener('click', () => {
  track.scrollBy({ left: -400, behavior: 'smooth' });
});

btnDireita.addEventListener('click', () => {
  track.scrollBy({ left: 400, behavior: 'smooth' });
});
