(() => {
  // Formato internacional, só dígitos: DDI + DDD + número. Ex.: 5541999999999
  const WHATSAPP_NUMERO = '5595991618031';

  const form = document.getElementById('form-contato');
  const erro = document.getElementById('contato-erro');

  // ano do rodapé sempre atualizado
  document.getElementById('ano').textContent = new Date().getFullYear();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !mensagem) {
      erro.textContent = 'Preencha o nome e a mensagem.';
      erro.hidden = false;
      return;
    }
    erro.hidden = true;

    const texto = `Olá Ítalo! Meu nome é ${nome}. ${mensagem}`;
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
})();