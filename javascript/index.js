// Carica header e footer
document.addEventListener('DOMContentLoaded', function() {
  // Carica header
  fetch('partials/header.html')
    .then(response => {
      if (!response.ok) throw new Error('Cabeçalho não encontrado');
      return response.text();
    })
    .then(data => {
      document.getElementById('site-header').innerHTML = data;
      
      // Aggiunge classe active al link corrente
      const currentPage = window.location.pathname.split('/').pop();
      document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage.includes('privacy') && linkPage.includes('privacy')) ||
            (currentPage.includes('cookie') && linkPage.includes('cookie'))) {
          link.classList.add('active');
        }
      });
    })
    .catch(error => {
      console.error('❌ Erro no cabeçalho:', error);
      document.getElementById('site-header').innerHTML = '<div style="background:#f00; color:#fff; padding:20px; text-align:center;">ERRO: Cabeçalho não carregado</div>';
    });
  
  // Carica footer
  fetch('partials/footer.html')
    .then(response => {
      if (!response.ok) throw new Error('Rodapé não encontrado');
      return response.text();
    })
    .then(data => {
      document.getElementById('site-footer').innerHTML = data;
    })
    .catch(error => {
      console.error('❌ Erro no rodapé:', error);
      document.getElementById('site-footer').innerHTML = '<div style="background:#f00; color:#fff; padding:20px; text-align:center;">ERRO: Rodapé não carregado</div>';
    });
});