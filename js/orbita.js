// Órbita do topo: no início só a foto; conforme a página rola, os serviços saem do rosto,
// abrem em órbita e ficam ligados por fios com pacotes de dados correndo.
// No computador o topo fica preso na tela durante essa abertura; no celular ela abre sozinha.
(() => {
  const palco = document.getElementById('orbita');
  if (!palco) return;
  const hero = palco.closest('.hero'), fixo = hero.querySelector('.hero__fixo');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const largo = matchMedia('(min-width: 961px)');

  const icones = {
    site: '<path d="M3 4h18v12H3z"/><path d="M8 20h8M12 16v4"/>',
    whats: '<path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L3.5 21l1.4-5A8.5 8.5 0 1 1 21 12z"/><path d="M9 10.5c0 2.5 2 4.5 4.5 4.5"/>',
    robo: '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 4v4M9.5 13h0M14.5 13h0"/><path d="M2 13v2M22 13v2"/>',
    agenda: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    raio: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    live: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>'
  };
  const servicos = [
    ['site', 'Sites', 'no ar 24h'],
    ['whats', 'Catálogo no WhatsApp', 'pedido recebido'],
    ['robo', 'Robô de atendimento', 'respondendo'],
    ['agenda', 'Agendamento', '3 horários hoje'],
    ['raio', 'Rede e energia', 'monitorando'],
    ['live', 'Transmissão ao vivo', 'sessão no ar']
  ].slice(0, innerWidth < 600 ? 5 : 6);

  const cartoes = servicos.map(([ic, titulo, status]) => {
    const c = document.createElement('div');
    c.className = 'orbita__cartao';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML = `<svg viewBox="0 0 24 24">${icones[ic]}</svg><div><b>${titulo}</b><small><i></i>${status}</small></div>`;
    return palco.appendChild(c);
  });
  palco.setAttribute('aria-label', 'Serviços: ' + servicos.map(s => s[1]).join(', '));
  const n = cartoes.length;

  const fios = palco.querySelector('.orbita__fios');
  fios.innerHTML =
    '<ellipse fill="none" stroke="#e8b84b" stroke-dasharray="2 6"/>' +
    cartoes.map(() => '<line stroke="#e8b84b" stroke-width="1.4" stroke-dasharray="4 4"/>').join('') +
    cartoes.map(() => '<circle r="3.2" fill="#ffe7a1" opacity="0" style="filter:drop-shadow(0 0 4px #e8b84b)"/>').join('') +
    cartoes.map(() => '<circle r="2.4" fill="#fff3c4" opacity="0" style="filter:drop-shadow(0 0 3px #e8b84b)"/>').join('');
  const elipse = fios.querySelector('ellipse');
  const linhas = [...fios.querySelectorAll('line')];
  const bolas = [...fios.querySelectorAll('circle')];
  const saem = bolas.slice(0, n), pulam = bolas.slice(n);
  const dica = palco.querySelector('.orbita__dica');

  // Quanto a órbita já abriu (0 a 1)
  let abertura = calmo ? 1 : 0, inicioAuto = null;
  const presa = () => largo.matches && !calmo;
  const ajustarPresa = () => hero.classList.toggle('hero--presa', presa());
  ajustarPresa();
  largo.addEventListener('change', ajustarPresa);

  function medirAbertura(t) {
    if (calmo) return 1;
    if (presa()) {
      const caminho = hero.offsetHeight - fixo.offsetHeight;
      return Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / (caminho * .8)));
    }
    // celular: abre sozinha quando a foto aparece
    if (inicioAuto === null) return 0;
    return Math.min(1, (t - inicioAuto) / 1800);
  }
  new IntersectionObserver((e) => {
    if (e[0].isIntersecting && inicioAuto === null) inicioAuto = performance.now() + 400;
  }, { threshold: .4 }).observe(palco);

  const suave = (x) => 1 - Math.pow(1 - x, 3);
  const centros = cartoes.map(() => [0, 0]);
  let visivel = true;
  new IntersectionObserver((e) => { visivel = e[0].isIntersecting; }).observe(palco);

  function quadro(t) {
    requestAnimationFrame(quadro);
    if (!visivel) return;
    abertura = medirAbertura(t);
    const w = palco.clientWidth, h = palco.clientHeight, cx = w / 2, cy = h / 2;
    const raio = palco.querySelector('.orbita__eu').offsetWidth / 2;
    fios.setAttribute('viewBox', `0 0 ${w} ${h}`);
    elipse.setAttribute('cx', cx); elipse.setAttribute('cy', cy);
    elipse.setAttribute('rx', w * .40 * suave(abertura)); elipse.setAttribute('ry', h * .41 * suave(abertura));
    elipse.setAttribute('stroke-opacity', .22 * abertura);
    dica.style.opacity = Math.max(0, 1 - abertura * 5);

    const acesos = new Set();
    cartoes.forEach((c, i) => {
      // cada cartão sai um pouco depois do anterior
      const p = suave(Math.min(1, Math.max(0, (abertura - i * .07) / (1 - (n - 1) * .07))));
      const a = (i / n) * Math.PI * 2 + (calmo ? 0 : t / 11000);
      const sen = Math.sin(a), frente = (sen + 1) / 2;
      const x = cx + Math.cos(a) * w * .40 * p, y = cy + sen * h * .41 * p;
      centros[i] = [x, y];
      c.style.transform = `translate(${x - c.offsetWidth / 2}px, ${y - c.offsetHeight / 2}px) scale(${(.78 + .22 * frente) * (.4 + .6 * p)})`;
      c.style.zIndex = sen > -.15 && p > .5 ? 3 : 1;
      c.style.opacity = (.5 + .5 * frente) * p;

      // fio da borda da foto até o cartão
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1;
      const sx = cx + dx / d * raio, sy = cy + dy / d * raio;
      const l = linhas[i];
      l.setAttribute('x1', sx); l.setAttribute('y1', sy); l.setAttribute('x2', x); l.setAttribute('y2', y);
      l.setAttribute('stroke-opacity', d > raio ? (.25 + .45 * frente) * p : 0);
      l.setAttribute('stroke-dashoffset', calmo ? 0 : -t / 60);

      // pacote saindo do rosto até o cartão
      const f = ((t + i * 900) % 4200) / 1300, b = saem[i];
      if (!calmo && p > .95 && f <= 1) {
        b.setAttribute('cx', sx + (x - sx) * f); b.setAttribute('cy', sy + (y - sy) * f);
        b.setAttribute('opacity', f < .08 ? 0 : 1);
        if (f > .95) acesos.add(i);
      } else b.setAttribute('opacity', 0);
      if (!calmo && p > .95 && f > 1 && f < 1.5) acesos.add(i);
    });

    // pacote pulando de um cartão para o vizinho
    pulam.forEach((b, i) => {
      const f = ((t + i * 1700 + 600) % (n * 1700)) / 1500;
      if (calmo || abertura < 1 || f > 1) { b.setAttribute('opacity', 0); return; }
      const [x1, y1] = centros[i], [x2, y2] = centros[(i + 1) % n];
      b.setAttribute('cx', x1 + (x2 - x1) * f); b.setAttribute('cy', y1 + (y2 - y1) * f);
      b.setAttribute('opacity', f < .1 || f > .9 ? .3 : .9);
      if (f > .9) acesos.add((i + 1) % n);
    });
    cartoes.forEach((c, i) => c.classList.toggle('aceso', acesos.has(i)));
  }
  requestAnimationFrame(quadro);
})();
