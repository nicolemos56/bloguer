
//logica das rotas

// Array global para armazenar músicas
let musicasGlobal = [
  { id: 1, titulo: 'Bem Estar', artista: 'MCK', categoria: 'Rap', duracao: '4:23', link: '/musicas/bem-estar.mp3', cover: 'https://i.scdn.co/image/ab67616d0000b27351f3c1edc9b0b0b2b8b2b0b2' },
  { id: 2, titulo: 'African Beauty', artista: 'C4 Pedro', categoria: 'Kizomba', duracao: '4:15', link: '/musicas/african-beauty.mp3', cover: 'https://i.scdn.co/image/ab67616d0000b27351f3c1edc9b0b0b2b8b2b0b3' },
  { id: 3, titulo: 'Kuduro Dance', artista: 'Puto Português', categoria: 'Kuduro', duracao: '3:45', link: '/musicas/kuduro-dance.mp3', cover: 'https://i.scdn.co/image/ab67616d0000b27351f3c1edc9b0b0b2b8b2b0b4' },
  { id: 4, titulo: 'Mona Ki Ngi Xica', artista: 'Bonga', categoria: 'Semba', duracao: '4:56', link: '/musicas/mona-ki-ngi-xica.mp3', cover: 'https://i.scdn.co/image/ab67616d0000b27351f3c1edc9b0b0b2b8b2b0b5' },
  { id: 5, titulo: 'Luanda Nights', artista: 'DJ Vado Poster', categoria: 'Afro House', duracao: '5:12', link: '/musicas/luanda-nights.mp3', cover: 'https://i.scdn.co/image/ab67616d0000b27351f3c1edc9b0b0b2b8b2b0b6' }
];

module.exports = {
  home: (req, res) => {
    // Função para obter músicas em destaque (3 mais recentes)
    const musicasEmDestaque = [...musicasGlobal]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
    
    // Função para obter artistas do mês (baseado em quantidade de músicas)
    const contagemArtistas = {};
    musicasGlobal.forEach(musica => {
      contagemArtistas[musica.artista] = (contagemArtistas[musica.artista] || 0) + 1;
    });
    
    const artistasDoMes = Object.entries(contagemArtistas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([artista, quantidade]) => {
        const musicaArtista = musicasGlobal.find(m => m.artista === artista);
        return {
          nome: artista,
          musicas: quantidade,
          categoria: musicaArtista?.categoria || 'Vários',
          imagem: musicaArtista?.cover || '/assets/images/default-artist.jpg'
        };
      });
    
    // Músicas populares por categoria (1 por categoria)
    const categorias = ['Kuduro', 'Rap', 'Kizomba', 'Semba', 'Afro House', 'Gheto Zouk'];
    const musicasPorCategoria = categorias.map(categoria => {
      const musicaCategoria = musicasGlobal.find(m => 
        m.categoria.toLowerCase().replace(/[^a-z]/g, '') === categoria.toLowerCase().replace(/[^a-z]/g, '')
      );
      return musicaCategoria;
    }).filter(Boolean);
    
    res.render('pages/home', { 
      title: 'VIB Music - Página Inicial',
      musicasEmDestaque: musicasEmDestaque,
      artistasDoMes: artistasDoMes,
      musicasPorCategoria: musicasPorCategoria
    });
  },
  artistas: (req, res) => res.render('pages/artistas'),
  categoria: (req, res) => res.render('pages/categoria', { title: 'Categoria' }),
  divulgar: (req, res) => res.render('pages/divulgar', { title: 'Divulgar' }),
  categorias: (req, res) => {
    // Dados das categorias musicais
    const categorias = [
      {
        id: 'kuduro',
        nome: 'Kuduro',
        descricao: 'Ritmo energético e dançante de Angola',
        imagem: 'pessoas_dancando.jpg',
        cor: '#e17d18'
      },
      {
        id: 'rap',
        nome: 'Rap/Hip-Hop',
        descricao: 'Música urbana com batidas fortes e letras expressivas',
        imagem: 'pesso_com_micro.jpg',
        cor: '#ff0000'
      },
      {
        id: 'afrohouse',
        nome: 'Afro House',
        descricao: 'Fusão de house music com ritmos africanos',
        imagem: 'forca_suprema.jpg',
        cor: '#0051ff'
      },
      {
        id: 'semba',
        nome: 'Semba',
        descricao: 'Música tradicional angolana, precursora da samba',
        imagem: 'pessoas_com_roupa_vermelha.jpg',
        cor: '#ff8900'
      },
      {
        id: 'kizomba',
        nome: 'Kizomba',
        descricao: 'Ritmo romântico e sensual de Angola e Cabo Verde',
        imagem: 'plutonio.jpg',
        cor: '#8b5cf6'
      },
      {
        id: 'gheto-zouk',
        nome: 'Gheto Zouk',
        descricao: 'Fusão moderna do zouk com influências urbanas',
        imagem: 'ouvindo_musica.png',
        cor: '#10b981'
      }
    ];
    
    res.render('pages/categorias', { 
      title: 'Categorias Musicais',
      categorias: categorias
    });
  },
  
  categoriaIndividual: (req, res) => {
    const categoriaId = req.params.id;
    
    // Função para filtrar músicas por categoria
    const filtrarMusicasPorCategoria = (nomeCategoria) => {
      return musicasGlobal.filter(musica => {
        const musicaCategoria = musica.categoria.toLowerCase().replace(/[^a-z]/g, '');
        const targetCategoria = nomeCategoria.toLowerCase().replace(/[^a-z]/g, '');
        return musicaCategoria === targetCategoria || 
               musicaCategoria.includes(targetCategoria) ||
               targetCategoria.includes(musicaCategoria);
      });
    };
    
    // Dados das categorias (agora com músicas reais do admin)
    const categorias = {
      'kuduro': {
        id: 'kuduro',
        nome: 'Kuduro',
        descricao: 'Ritmo energético e dançante de Angola',
        descricaoLonga: 'O Kuduro é um género musical e dança que surgiu em Angola na década de 1990. Caracteriza-se pelos seus ritmos acelerados, batidas electrónicas e movimentos de dança energéticos. É uma expressão cultural única que combina influências tradicionais angolanas com elementos modernos.',
        imagem: 'pessoas_dancando.jpg',
        cor: '#e17d18',
        artistas: [
          { nome: 'Puto Português', imagem: 'baixar.png', musicas: 15 },
          { nome: 'Titica', imagem: 'emana.jpg', musicas: 23 },
          { nome: 'Cabo Snoop', imagem: '12furos.jpg', musicas: 18 }
        ],
        musicasPopulares: filtrarMusicasPorCategoria('Kuduro')
      },
      'rap': {
        id: 'rap',
        nome: 'Rap/Hip-Hop',
        descricao: 'Música urbana com batidas fortes e letras expressivas',
        descricaoLonga: 'O Rap angolano cresceu significativamente nas últimas décadas, tornando-se uma voz poderosa da juventude urbana. Com letras que abordam questões sociais, políticas e do quotidiano, o hip-hop angolano conquistou um lugar de destaque na música nacional.',
        imagem: 'pesso_com_micro.jpg',
        cor: '#ff0000',
        artistas: [
          { nome: 'MCK', imagem: 'preto_show.jpg', musicas: 28 },
          { nome: 'Prodígio', imagem: 'IMG-20250209-WA0010.jpg', musicas: 34 },
          { nome: 'Boss AC', imagem: 'paulelson.jpg', musicas: 21 }
        ],
        musicasPopulares: filtrarMusicasPorCategoria('Rap')
      },
      'afrohouse': {
        id: 'afrohouse',
        nome: 'Afro House',
        descricao: 'Fusão de house music com ritmos africanos',
        descricaoLonga: 'O Afro House combina a energia da música house electrónica com os ritmos tradicionais africanos, criando uma fusão única que faz dançar. Este género tem ganhado popularidade internacional, com Angola na vanguarda da produção.',
        imagem: 'forca_suprema.jpg',
        cor: '#0051ff',
        artistas: [
          { nome: 'Djeff', imagem: 'xuxu.jpg', musicas: 19 },
          { nome: 'Dj Vado Poster', imagem: '12furos.jpg', musicas: 26 },
          { nome: 'Kelson Most Wanted', imagem: 'IMG-20250209-WA0012.jpg', musicas: 17 }
        ],
        musicasPopulares: filtrarMusicasPorCategoria('Afro House')
      },
      'semba': {
        id: 'semba',
        nome: 'Semba',
        descricao: 'Música tradicional angolana, precursora da samba',
        descricaoLonga: 'O Semba é um género musical tradicional de Angola, considerado o precursor da samba brasileira. Com ritmos cadenciados e letras que contam histórias do povo angolano, o semba é uma expressão cultural fundamental da identidade nacional.',
        imagem: 'pessoas_com_roupa_vermelha.jpg',
        cor: '#ff8900',
        artistas: [
          { nome: 'Bonga', imagem: 'paulelson.jpg', musicas: 45 },
          { nome: 'Paulo Flores', imagem: 'emana.jpg', musicas: 38 },
          { nome: 'Waldemar Bastos', imagem: 'preto_show.jpg', musicas: 42 }
        ],
        musicasPopulares: filtrarMusicasPorCategoria('Semba')
      },
      'kizomba': {
        id: 'kizomba',
        nome: 'Kizomba',
        descricao: 'Ritmo romântico e sensual de Angola e Cabo Verde',
        descricaoLonga: 'A Kizomba é um género musical e dança que nasceu em Angola na década de 1980. Com influências do semba angolano e do zouk das Antilhas, a kizomba conquistou o mundo com seus ritmos suaves e românticos, perfeitos para dançar a dois.',
        imagem: 'plutonio.jpg',
        cor: '#8b5cf6',
        artistas: [
          { nome: 'C4 Pedro', imagem: 'IMG-20250209-WA0014.jpg', musicas: 31 },
          { nome: 'Anselmo Ralph', imagem: 'baixar.png', musicas: 29 },
          { nome: 'Maya Cool', imagem: 'xuxu.jpg', musicas: 22 }
        ],
        musicasPopulares: filtrarMusicasPorCategoria('Kizomba')
      },
      'gheto-zouk': {
        id: 'gheto-zouk',
        nome: 'Gheto Zouk',
        descricao: 'Fusão moderna do zouk com influências urbanas',
        descricaoLonga: 'O Gheto Zouk é uma evolução moderna do zouk tradicional, incorporando elementos urbanos e contemporâneos. Este género representa a nova geração da música angolana, combinando tradição com inovação.',
        imagem: 'ouvindo_musica.png',
        cor: '#10b981',
        artistas: [
          { nome: 'Yola Semedo', imagem: 'emana.jpg', musicas: 25 },
          { nome: 'Gama', imagem: '12furos.jpg', musicas: 19 },
          { nome: 'Pérola', imagem: 'IMG-20250209-WA0010.jpg', musicas: 33 }
        ],
        musicasPopulares: filtrarMusicasPorCategoria('Gheto Zouk')
      }
    };
    
    const categoria = categorias[categoriaId];
    
    if (!categoria) {
      return res.status(404).render('pages/404', { 
        title: 'Categoria não encontrada',
        message: 'A categoria solicitada não existe.'
      });
    }
    
    res.render('pages/categoria', {
      title: categoria.nome,
      categoria: categoria
    });
  },
  
  // Admin Controllers
  adminDashboard: (req, res) => {
    const stats = {
      totalMusicas: 156,
      totalArtistas: 48,
      totalCategorias: 6,
      totalPlays: '2.4M',
      musicasRecentes: [
        { titulo: 'Bem Estar', artista: 'MCK', data: '2025-01-15', plays: '125K' },
        { titulo: 'African Beauty', artista: 'C4 Pedro', data: '2025-01-12', plays: '98K' },
        { titulo: 'Kuduro Dance', artista: 'Puto Português', data: '2025-01-10', plays: '87K' }
      ]
    };
    
    res.render('admin/dashboard', {
      title: 'Painel Admin - VIB Music',
      stats: stats
    });
  },
  
  adminMusicas: (req, res) => {
    const { search, categoria } = req.query;
    let musicasFiltradas = [...musicasGlobal];
    
    // Filtrar por pesquisa
    if (search) {
      musicasFiltradas = musicasFiltradas.filter(musica => 
        musica.titulo.toLowerCase().includes(search.toLowerCase()) ||
        musica.artista.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtrar por categoria
    if (categoria) {
      musicasFiltradas = musicasFiltradas.filter(musica => 
        musica.categoria.toLowerCase().replace(/[^a-z]/g, '') === categoria.toLowerCase()
      );
    }
    
    res.render('admin/musicas', {
      title: 'Gerir Músicas - Admin',
      musicas: musicasFiltradas,
      filtros: { search: search || '', categoria: categoria || '' }
    });
  },
  
  adminArtistas: (req, res) => {
    const artistas = [
      { id: 1, nome: 'MCK', email: 'mck@example.com', musicas: 28, categoria: 'Rap', status: 'Ativo' },
      { id: 2, nome: 'C4 Pedro', email: 'c4pedro@example.com', musicas: 31, categoria: 'Kizomba', status: 'Ativo' },
      { id: 3, nome: 'Puto Português', email: 'puto@example.com', musicas: 15, categoria: 'Kuduro', status: 'Ativo' },
      { id: 4, nome: 'Bonga', email: 'bonga@example.com', musicas: 45, categoria: 'Semba', status: 'Ativo' },
      { id: 5, nome: 'DJ Vado Poster', email: 'vado@example.com', musicas: 26, categoria: 'Afro House', status: 'Ativo' }
    ];
    
    res.render('admin/artistas', {
      title: 'Gerir Artistas - Admin',
      artistas: artistas
    });
  },
  
  adminCategorias: (req, res) => {
    const categorias = [
      { id: 1, nome: 'Kuduro', musicas: 45, artistas: 12, cor: '#e17d18', status: 'Ativa' },
      { id: 2, nome: 'Rap/Hip-Hop', musicas: 38, artistas: 15, cor: '#ff0000', status: 'Ativa' },
      { id: 3, nome: 'Kizomba', musicas: 42, artistas: 18, cor: '#8b5cf6', status: 'Ativa' },
      { id: 4, nome: 'Semba', musicas: 35, artistas: 8, cor: '#ff8900', status: 'Ativa' },
      { id: 5, nome: 'Afro House', musicas: 28, artistas: 10, cor: '#0051ff', status: 'Ativa' },
      { id: 6, nome: 'Gheto Zouk', musicas: 22, artistas: 7, cor: '#10b981', status: 'Ativa' }
    ];
    
    res.render('admin/categorias', {
      title: 'Gerir Categorias - Admin',
      categorias: categorias
    });
  },
  
  addMusica: (req, res) => {
    try {
      const { titulo, artista, categoria, duracao, album } = req.body;
      
      // Verificar se os dados necessários estão presentes
      if (!titulo || !artista || !categoria || !duracao) {
        return res.status(400).json({ 
          success: false, 
          message: 'Todos os campos obrigatórios devem ser preenchidos!' 
        });
      }
      
      // Verificar se o arquivo de música foi enviado
      if (!req.files || !req.files.musicFile || !req.files.musicFile[0]) {
        return res.status(400).json({
          success: false,
          message: 'Arquivo de música é obrigatório!'
        });
      }
      
      // Gerar novo ID
      const novoId = musicasGlobal.length > 0 ? Math.max(...musicasGlobal.map(m => m.id)) + 1 : 1;
      
      // Processar arquivos de upload
      const musicFile = req.files.musicFile[0];
      const musicFilePath = `/uploads/${musicFile.filename}`;
      
      let coverImagePath = '/assets/images/default-cover.jpg'; // imagem padrão
      if (req.files.coverImage && req.files.coverImage[0]) {
        coverImagePath = `/uploads/${req.files.coverImage[0].filename}`;
      }
      
      // Criar nova música
      const novaMusica = {
        id: novoId,
        titulo: titulo,
        artista: artista,
        categoria: categoria,
        duracao: duracao,
        album: album || '',
        link: musicFilePath,
        cover: coverImagePath,
        nomeOriginal: musicFile.originalname, // Guardar nome original
        nomeArquivo: musicFile.filename // Nome do arquivo no servidor
      };
      
      // Adicionar ao array global
      musicasGlobal.push(novaMusica);
      
      console.log('Nova música adicionada:', novaMusica);
      res.json({ success: true, message: 'Música adicionada com sucesso!' });
      
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao adicionar música!' 
      });
    }
  },
  
  addArtista: (req, res) => {
    // Simulação de adição de artista
    console.log('Novo artista adicionado:', req.body);
    res.json({ success: true, message: 'Artista adicionado com sucesso!' });
  },
  
  deleteMusica: (req, res) => {
    const musicaId = parseInt(req.params.id);
    const index = musicasGlobal.findIndex(m => m.id === musicaId);
    
    if (index !== -1) {
      musicasGlobal.splice(index, 1);
      console.log('Música removida:', musicaId);
      res.json({ success: true, message: 'Música removida com sucesso!' });
    } else {
      res.json({ success: false, message: 'Música não encontrada!' });
    }
  },
  
  deleteArtista: (req, res) => {
    const artistaId = req.params.id;
    console.log('Artista removido:', artistaId);
    res.json({ success: true, message: 'Artista removido com sucesso!' });
  },

  downloadMusica: (req, res) => {
    const musicaId = parseInt(req.params.id);
    const musica = musicasGlobal.find(m => m.id === musicaId);
    
    if (!musica) {
      return res.status(404).json({ 
        success: false, 
        message: 'Música não encontrada!' 
      });
    }
    
    const path = require('path');
    // Extrair nome do arquivo do link (remove /uploads/)
    const nomeArquivoServidor = musica.nomeArquivo || musica.link.replace('/uploads/', '');
    const caminhoArquivo = path.join(__dirname, '..', 'public', 'uploads', nomeArquivoServidor);
    
    // Definir nome original para download
    const nomeDownload = musica.nomeOriginal || `${musica.titulo} - ${musica.artista}.mp3`;
    
    res.download(caminhoArquivo, nomeDownload, (err) => {
      if (err) {
        console.error('Erro no download:', err);
        res.status(404).json({ 
          success: false, 
          message: 'Arquivo não encontrado!' 
        });
      }
    });
  }
};


