(() => {
  const lista = document.getElementById('lista-cases');
  const aviso = document.getElementById('cases-aviso');

  function criarCase(c) {
    const poster = c.poster ? ` poster="${esc(c.poster)}"` : '';
    return `
      <article class="case">
        <div class="case__midia">
          <video src="${esc(c.video)}"${poster} muted loop playsinline preload="metadata"
                 aria-label="Vídeo: ${esc(c.titulo)}"></video>
        </div>
        <div class="case__texto">
          <span class="case__local">${esc(c.local)}</span>
          <h3>${esc(c.titulo)}</h3>

          <h4>Problema</h4>
          <p>${esc(c.problema)}</p>
${c.papel ? `
          <h4>Minha participação</h4>
          <p>${esc(c.papel)}</p>
` : ''}
          <h4>Solução</h4>
          <ul>${c.solucao.map(s => `<li>${esc(s)}</li>`).join('')}</ul>

          <h4>Resultado</h4>
          <p>${esc(c.resultado)}</p>

          <ul class="tags">${c.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        </div>
      </article>`;
  }

  // anima o card ao aparecer e toca/pausa o vídeo conforme a visibilidade
  function observar() {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach(({ target, isIntersecting }) => {
        const video = target.querySelector('video');
        if (isIntersecting) {
          target.classList.add('case--visivel');
          if (video) video.play().catch(() => {});
        } else if (video) {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    lista.querySelectorAll('.case').forEach(el => observador.observe(el));
  }

  async function carregar() {
    try {
      const resposta = await fetch('data/cases.json');
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

      const cases = await resposta.json();
      lista.innerHTML = cases.map(criarCase).join('');
      observar();
    } catch (erro) {
      console.error('Erro ao carregar cases:', erro);
      lista.innerHTML = '';
      aviso.textContent = 'Não foi possível carregar os cases agora.';
      aviso.hidden = false;
    }
  }

  carregar();
})();