(() => {
  const lista = document.getElementById('lista-cases');
  const aviso = document.getElementById('cases-aviso');

  function criarCase(c) {
    const poster = c.poster ? ` poster="${esc(c.poster)}"` : '';
    return `
      <article class="case">
        <div class="case__midia">
          <video data-src="${esc(c.video)}"${poster} muted loop playsinline preload="none"
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

  // O servidor não responde a pedidos parciais (Range), e o Safari do iPhone não toca vídeo assim.
  // Por isso o vídeo é baixado inteiro e tocado a partir da memória (blob), onde o Range funciona.
  function carregarVideo(video) {
    if (video.dataset.carregado) return video.dataset.carregado === 'ok' ? Promise.resolve() : null;
    video.dataset.carregado = 'carregando';
    video.muted = true;   // o iPhone exige a propriedade (não só o atributo) para tocar sozinho

    return fetch(video.dataset.src)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); })
      .then((blob) => { video.src = URL.createObjectURL(blob); })
      .catch(() => { video.src = video.dataset.src; })   // se falhar, tenta o endereço direto
      .finally(() => { video.dataset.carregado = 'ok'; });
  }

  function tocar(video) {
    video.play().catch(() => {
      // Autoplay bloqueado (ex.: modo de economia de bateria): mostra o botão de play
      video.controls = true;
    });
  }

  // anima o card ao aparecer e toca/pausa o vídeo conforme a visibilidade
  function observar() {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach(({ target, isIntersecting }) => {
        const video = target.querySelector('video');
        if (isIntersecting) {
          target.classList.add('case--visivel');
          if (!video) return;
          const carregando = carregarVideo(video);
          if (carregando) carregando.then(() => { if (target.dataset.visivel === '1') tocar(video); });
        } else if (video) {
          video.pause();
        }
        target.dataset.visivel = isIntersecting ? '1' : '0';
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