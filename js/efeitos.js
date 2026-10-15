// Efeitos da página: barra de leitura, terminal digitando, contador de projetos,
// cena do WhatsApp e ferramentas acendendo uma a uma.
(() => {
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barra dourada embaixo do menu: quanto da página já foi lido
  const progresso = document.getElementById('progresso');
  const atualizarProgresso = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    progresso.style.setProperty('--lido', total > 0 ? Math.min(1, scrollY / total) : 0);
  };
  addEventListener('scroll', atualizarProgresso, { passive: true });
  atualizarProgresso();

  // Terminal do topo digitando o comando
  const digitando = document.getElementById('digitando');
  if (digitando && !calmo) {
    const texto = digitando.textContent;
    digitando.textContent = '';
    let i = 0;
    const passo = () => {
      digitando.textContent = texto.slice(0, ++i);
      if (i < texto.length) setTimeout(passo, 45 + Math.random() * 60);
    };
    setTimeout(passo, 400);
  }

  // Contador: projetos que estão funcionando ou no ar, contados a partir da lista de projetos
  const alvo = document.getElementById('num-projetos');
  const contar = (final) => {
    if (calmo) { alvo.textContent = final; return; }
    const inicio = performance.now();
    const quadro = (agora) => {
      const t = Math.min(1, (agora - inicio) / 1200);
      alvo.textContent = Math.round(final * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  };
  fetch('data/projetos.json')
    .then((r) => r.json())
    .then((projetos) => {
      const total = projetos.filter((p) => /funcionando|no ar/i.test(p.status)).length;
      new IntersectionObserver((entradas, obs) => {
        if (entradas[0].isIntersecting) { contar(total); obs.disconnect(); }
      }, { threshold: .5 }).observe(alvo);
    })
    .catch(() => {});   // sem a lista, fica o número escrito no HTML

  // Cena do WhatsApp: as mensagens aparecem quando a conversa entra na tela
  const conversa = document.getElementById('conversa');
  new IntersectionObserver((entradas, obs) => {
    if (entradas[0].isIntersecting) { conversa.classList.add('tocando'); obs.disconnect(); }
  }, { threshold: .4 }).observe(conversa);

  // Ferramentas: acendem uma de cada vez, com a explicação ao lado; clicar escolhe uma
  const botoes = [...document.querySelectorAll('#grupos-ferramentas button')];
  const painel = document.getElementById('ferramenta-atual');
  let atual = 0, timer = null;
  const mostrar = (n) => {
    atual = n;
    botoes.forEach((b, i) => { b.classList.toggle('acesa', i === n); b.classList.toggle('passou', i < n); });
    const b = botoes[n];
    painel.querySelector('b').textContent = b.lastChild.textContent.trim();
    painel.querySelector('small').textContent = `${String(n + 1).padStart(2, '0')}/${botoes.length}`;
    painel.querySelector('em').textContent = b.closest('.grupo').querySelector('h3').textContent;
    painel.querySelector('p').textContent = b.dataset.desc;
  };
  const rodar = () => { clearInterval(timer); if (!calmo) timer = setInterval(() => mostrar((atual + 1) % botoes.length), 2600); };
  botoes.forEach((b, i) => b.addEventListener('click', () => { mostrar(i); rodar(); }));
  new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) { rodar(); } else { clearInterval(timer); }
  }).observe(document.getElementById('grupos-ferramentas'));
  mostrar(0);
})();
