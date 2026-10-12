// Escapa texto antes de inserir em HTML (inclusive dentro de atributos).
// Carregado antes dos demais scripts.
function esc(texto) {
  if (texto == null) return '';
  return String(texto).replace(/[&<>'"]/g, t => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[t]));
}