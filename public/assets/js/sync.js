// Sistema de sincronização em tempo real para e Nessa Banda Mekié

class RealTimeSync {
  constructor() {
    this.syncInterval = null;
    this.init();
  }

  init() {
    // Não fazer sync se não estivermos numa página com contadores
    if (!this.hasCounters()) return;
    
    console.log('🔄 Sistema de sincronização automática iniciado');
    
    // Sync inicial após 5 segundos
    setTimeout(() => this.syncData(), 5000);
    
    // Sync a cada 15 segundos
    this.syncInterval = setInterval(() => this.syncData(), 15000);
    
    // Sync quando a página voltar ao foco
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('👁️ Página voltou ao foco - sincronizando...');
        this.syncData();
      }
    });
  }

  // Verificar se a página tem contadores para sincronizar
  hasCounters() {
    return document.querySelector('[data-likes]') || 
           document.querySelector('[data-plays]') || 
           document.querySelector('[data-seguidores]') ||
           document.querySelector('.likes-count') ||
           document.querySelector('.plays-count') ||
           document.querySelector('.followers-count');
  }

  // Função principal de sincronização
  async syncData() {
    try {
      const response = await fetch('/api/sync');
      if (!response.ok) throw new Error('Erro na sincronização');
      
      const result = await response.json();
      if (!result.success) throw new Error('Resposta inválida da API');
      
      // Atualizar contadores na interface
      this.updateCounters(result.data);
      
      console.log('✅ Dados sincronizados com sucesso', new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    }
  }

  // Atualizar contadores visuais na página
  updateCounters(data) {
    // Atualizar likes das músicas
    document.querySelectorAll('[data-likes]').forEach(element => {
      const musicaId = parseInt(element.getAttribute('data-likes'));
      if (data.musicas[musicaId]) {
        const newLikes = data.musicas[musicaId].likes;
        if (element.textContent != newLikes) {
          element.textContent = newLikes;
          this.animateUpdate(element);
        }
      }
    });
    
    // Atualizar plays das músicas
    document.querySelectorAll('[data-plays]').forEach(element => {
      const musicaId = parseInt(element.getAttribute('data-plays'));
      if (data.musicas[musicaId]) {
        const newPlays = data.musicas[musicaId].plays;
        if (element.textContent != newPlays) {
          element.textContent = newPlays;
          this.animateUpdate(element);
        }
      }
    });
    
    // Atualizar seguidores dos artistas
    document.querySelectorAll('[data-seguidores]').forEach(element => {
      const artistaId = parseInt(element.getAttribute('data-seguidores'));
      if (data.artistas[artistaId]) {
        const newSeguidores = data.artistas[artistaId].seguidores;
        if (element.textContent != newSeguidores) {
          element.textContent = newSeguidores;
          this.animateUpdate(element);
        }
      }
    });

    // Buscar por classes CSS também
    document.querySelectorAll('.likes-count, .plays-count, .followers-count').forEach(element => {
      const musicaId = element.getAttribute('data-music-id');
      const artistaId = element.getAttribute('data-artist-id');
      
      if (musicaId && data.musicas[musicaId]) {
        if (element.classList.contains('likes-count')) {
          const newLikes = data.musicas[musicaId].likes;
          if (element.textContent != newLikes) {
            element.textContent = newLikes;
            this.animateUpdate(element);
          }
        }
        if (element.classList.contains('plays-count')) {
          const newPlays = data.musicas[musicaId].plays;
          if (element.textContent != newPlays) {
            element.textContent = newPlays;
            this.animateUpdate(element);
          }
        }
      }
      
      if (artistaId && data.artistas[artistaId]) {
        if (element.classList.contains('followers-count')) {
          const newSeguidores = data.artistas[artistaId].seguidores;
          if (element.textContent != newSeguidores) {
            element.textContent = newSeguidores;
            this.animateUpdate(element);
          }
        }
      }
    });
  }

  // Animação para elementos atualizados
  animateUpdate(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'pulse 0.3s ease-in-out';
  }
}

// Inicializar sistema de sincronização quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  new RealTimeSync();
});