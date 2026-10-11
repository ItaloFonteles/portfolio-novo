# Portfólio · Ítalo Fonteles

Portfólio pessoal sobre **infraestrutura audiovisual, automação e desenvolvimento de sistemas**. Reúne meus projetos de software e os cases de campo da minha experiência com sistemas críticos, de Câmaras Municipais a tribunais.

🌐 **Site:** https://italofonteles.github.io/portfolio-novo/

<!-- TODO: adicionar um print do site em assets/img/preview.png e descomentar a linha abaixo -->
<!-- ![Prévia do portfólio](assets/img/preview.png) -->

---

## Sobre o projeto

A ideia do portfólio é contar uma trajetória: **operar sistemas em campo e agora construir as ferramentas que automatizam esse trabalho**. Por isso o site mistura duas frentes:

- **Projetos de software:** o que estou construindo em ADS, Python, Java, Docker e n8n.
- **Experiência de campo:** cases de infraestrutura A/V e TI, no formato *problema → solução → resultado*.

## Funcionalidades

- Projetos e cases renderizados a partir de arquivos **JSON** (para adicionar um item, basta editar o JSON, sem mexer no HTML).
- **Filtro de projetos** por categoria, gerado automaticamente a partir dos dados.
- Linha do tempo da trajetória (Riole → ADS → Automação).
- Vídeos dos cases que tocam e pausam conforme entram e saem da tela.
- Animações de aparecer ao rolar (`IntersectionObserver`).
- Menu responsivo com versão mobile.
- Formulário de contato que abre o WhatsApp com a mensagem pronta.
- Conteúdo dos JSON escapado antes de ir para o HTML, evitando injeção de código.
- Respeita a preferência do sistema por menos animação (`prefers-reduced-motion`).

## Tecnologias

| Camada | Uso |
|--------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Variáveis, Grid, Flexbox, media queries |
| JavaScript (ES6+) | `fetch`, `async/await`, `IntersectionObserver`, manipulação do DOM |
| Git / GitHub | Versionamento e hospedagem |
| GitHub Pages | Publicação do site |

Sem frameworks e sem etapa de build: o projeto é HTML, CSS e JavaScript puros.

## Estrutura de pastas

```
portfolio-novo/
├── index.html
├── css/
│   ├── base.css          # variáveis de tema, reset e tipografia
│   └── components.css    # navbar, hero, cards, cases, contato
├── js/
│   ├── main.js           # menu mobile e animação de reveal
│   ├── projetos.js       # renderiza projetos e filtros
│   ├── cases.js          # renderiza a experiência de campo
│   └── contato.js        # formulário de contato via WhatsApp
├── data/
│   ├── projetos.json     # lista de projetos de software
│   └── cases.json        # cases de campo
└── assets/
    ├── img/
    ├── video/
    └── curriculo.pdf
```

## Como rodar localmente

Os dados são carregados com `fetch`, que **não funciona abrindo o `index.html` direto no navegador** (protocolo `file://`). É preciso um servidor local.

**Opção 1: VS Code**

1. Instale a extensão **Live Server**.
2. Abra a pasta do projeto e clique em **Go Live** na barra de status.

**Opção 2: Python**

```bash
git clone https://github.com/ItaloFonteles/portfolio-novo.git
cd portfolio-novo
python -m http.server 5500
```

Depois acesse `http://localhost:5500`.

## Como adicionar conteúdo

**Novo projeto:** acrescente um objeto em `data/projetos.json`.

```json
{
  "titulo": "Nome do projeto",
  "resumo": "O que ele faz, em uma ou duas frases.",
  "tags": ["Python", "Docker"],
  "categoria": "automacao",
  "status": "Em desenvolvimento",
  "repo": "https://github.com/ItaloFonteles/nome-do-repo",
  "demo": null
}
```

- `categoria` cria o botão de filtro automaticamente.
- `repo` e `demo` aceitam um link ou `null`. Com `null`, o botão não aparece.

**Novo case de campo:** acrescente um objeto em `data/cases.json` com `titulo`, `local`, `video`, `poster`, `problema`, `solucao` (lista), `resultado` e `tags`.

## Personalização

Todas as cores, fontes e medidas ficam nas variáveis do `:root` em `css/base.css`. Para mudar o tema inteiro, basta alterar esse bloco.

## Publicação

O site é publicado com **GitHub Pages**, a partir da branch `main` (pasta raiz). Cada `git push` atualiza o site em poucos minutos.

## Contato

- LinkedIn: [Ítalo Fonteles](https://www.linkedin.com/in/italo-fonteles-543984356/)
- GitHub: [@ItaloFonteles](https://github.com/ItaloFonteles)

---

© Ítalo Fonteles. O conteúdo textual, as imagens e os vídeos deste repositório são de uso exclusivo do autor.
