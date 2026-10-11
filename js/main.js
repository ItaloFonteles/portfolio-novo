const toggle = document.querySelector('.navbar__toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  toggle.setAttribute('aria-expanded', aberto);
});

// fecha o menu ao clicar em um link (mobile)
menu.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    toggle.setAttribute('aria-expanded', false);
  })
);
// Reveal: elementos aparecem ao rolar a página
const revelaveis = document.querySelectorAll('.reveal');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('active');
      observador.unobserve(entrada.target); // anima só uma vez
    }
  });
}, { threshold: 0.15 });

revelaveis.forEach(el => observador.observe(el));