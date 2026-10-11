const ROTULOS = {
  todos: 'Todos',
  sistemas: 'Sistemas',
  automacao: 'Automação',
  infra: 'Infraestrutura'
};

const lista = document.getElementById('lista-projetos');
const filtros = document.getElementById('filtros');
const aviso = document.getElementById('projetos-aviso');

let projetos = [];

// evita que texto do JSON seja interpretado como HTML
function esc(texto) {
  const el = document.createElement('span');
  el.textContent = texto;
  return el.innerHTML;
}

function criarCard(p) {
  const links = [];
  if (p.repo) links.push(`<a href="${esc(p.repo)}" target="_blank" rel="noopener">Ver código</a>`);
  if (p.demo) links.push(`<a href="${esc(p.demo)}" target="_blank" rel="noopener">Demo</a>`);
  if (links.length === 0) links.push('<span class="card__breve">Código em breve</span>');

  return `
    <article class="card">
      <span class="card__status">${esc(p.status)}</span>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.resumo)}</p>
      <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="card__links">${links.join('')}</div>
    </article>`;
}

function renderizar(categoria) {
  const visiveis = categoria === 'todos'
    ? projetos
    : projetos.filter(p => p.categoria === categoria);

  lista.innerHTML = visiveis.map(criarCard).join('');
}

function criarFiltros() {
  const categorias = ['todos', ...new Set(projetos.map(p => p.categoria))];

  filtros.innerHTML = categorias.map((c, i) => `
    <button class="filtro${i === 0 ? ' filtro--ativo' : ''}" data-filtro="${c}">
      ${ROTULOS[c] || c}
    </button>`).join('');

  filtros.addEventListener('click', (e) => {
    const botao = e.target.closest('.filtro');
    if (!botao) return;

    filtros.querySelectorAll('.filtro').forEach(b => b.classList.remove('filtro--ativo'));
    botao.classList.add('filtro--ativo');
    renderizar(botao.dataset.filtro);
  });
}

async function carregarProjetos() {
  try {
    const resposta = await fetch('data/projetos.json');
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    projetos = await resposta.json();
    criarFiltros();
    renderizar('todos');
  } catch (erro) {
    console.error('Erro ao carregar projetos:', erro);
    aviso.textContent = 'Não foi possível carregar os projetos agora.';
    aviso.hidden = false;
  }
}

carregarProjetos();