
//logica das rotas

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Arquivo para persistir dados
const dataDir = path.join(__dirname, '..', 'data');
const artistasFile = path.join(dataDir, 'artistas.json');
const musicasFile = path.join(dataDir, 'musicas.json');

// Função para garantir que o diretório data existe
function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Função para carregar artistas do arquivo
function loadArtistas() {
  ensureDataDir();
  try {
    if (fs.existsSync(artistasFile)) {
      const data = fs.readFileSync(artistasFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar artistas:', error);
  }
  return [];
}

// Função para salvar artistas no arquivo
function saveArtistas(artistas) {
  ensureDataDir();
  try {
    fs.writeFileSync(artistasFile, JSON.stringify(artistas, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar artistas:', error);
    return false;
  }
}

// Função para carregar músicas do arquivo
function loadMusicas() {
  ensureDataDir();
  try {
    if (fs.existsSync(musicasFile)) {
      const data = fs.readFileSync(musicasFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar músicas:', error);
  }
  return [];
}

// Função para salvar músicas no arquivo
function saveMusicas(musicas) {
  ensureDataDir();
  try {
    fs.writeFileSync(musicasFile, JSON.stringify(musicas, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar músicas:', error);
    return false;
  }
}

// Carregar dados persistidos ou inicializar com dados padrão
let musicasGlobal = loadMusicas();
let artistasGlobal = loadArtistas();

// Se os arquivos estão vazios, inicializar com dados padrão
if (musicasGlobal.length === 0) {
  musicasGlobal = [
    {
      id: 1,
      nome: 'Kuzola',
      artista: 'Anselmo Ralph',
      categoria: 'Kizomba',
      ano: 2010,
      arquivo: '/assets/audio/kuzola.mp3',
      imagem: '/assets/imagens/imagens_musicas/kuzola.jpg',
      plays: 1200,
      likes: 45,
      downloads: 89
    },
    {
      id: 2,
      nome: 'Windeck',
      artista: 'Puto Português',
      categoria: 'Kuduro',
      ano: 2019,
      arquivo: '/assets/audio/windeck.mp3',
      imagem: '/assets/imagens/imagens_musicas/windeck.jpg',
      plays: 2300,
      likes: 78,
      downloads: 156
    },
    {
      id: 3,
      nome: 'Dança Kuduro',
      artista: 'Don Omar ft. Lucenzo',
      categoria: 'Kuduro',
      ano: 2010,
      arquivo: '/assets/audio/danca-kuduro.mp3',
      imagem: '/assets/imagens/imagens_musicas/danca-kuduro.jpg',
      plays: 5400,
      likes: 234,
      downloads: 445
    },
    {
      id: 4,
      nome: 'Miúda Linda',
      artista: 'Matias Damásio',
      categoria: 'Semba',
      ano: 2015,
      arquivo: '/assets/audio/miuda-linda.mp3',
      imagem: '/assets/imagens/imagens_musicas/miuda-linda.jpg',
      plays: 3200,
      likes: 145,
      downloads: 234
    },
    {
      id: 5,
      nome: 'Lágrimas',
      artista: 'Yola Semedo',
      categoria: 'Kizomba',
      ano: 2018,
      arquivo: '/assets/audio/lagrimas.mp3',
      imagem: '/assets/imagens/imagens_musicas/lagrimas.jpg',
      plays: 1800,
      likes: 67,
      downloads: 123
    }
  ];
  saveMusicas(musicasGlobal);
}

if (artistasGlobal.length === 0) {
  artistasGlobal = [
    {
      id: 1,
      nome: 'Anselmo Ralph',
      categoria: 'Kizomba',
      biografia: 'Cantor angolano de Kizomba e R&B',
      imagem: '/assets/imagens/imagens_artistas/anselmo-ralph.jpg',
      seguidores: 1250
    },
    {
      id: 2,
      nome: 'Puto Português',
      categoria: 'Kuduro',
      biografia: 'Pioneiro do Kuduro em Angola',
      imagem: '/assets/imagens/imagens_artistas/puto-portugues.jpg',
      seguidores: 890
    },
    {
      id: 3,
      nome: 'Matias Damásio',
      categoria: 'Semba',
      biografia: 'Cantor e compositor angolano',
      imagem: '/assets/imagens/imagens_artistas/matias-damasio.jpg',
      seguidores: 2100
    },
    {
      id: 4,
      nome: 'Yola Semedo',
      categoria: 'Kizomba',
      biografia: 'Cantora de Kizomba e Zouk',
      imagem: '/assets/imagens/imagens_artistas/yola-semedo.jpg',
      seguidores: 750
    }
  ];
  saveArtistas(artistasGlobal);
}

console.log('=== CONTROLLER INICIALIZADO ===');
console.log('Array de artistas inicializado:', artistasGlobal.length);

module.exports = {
  // API endpoint para obter todos os artistas
  getArtistas: (req, res) => {
    return res.json(artistasGlobal || []);
  },

  // Endpoint para verificar estado atual do usuário
  getUserState: (req, res) => {
    const usuario = verificarUsuarioLogado(req);
    
    if (!usuario) {
      return res.json({ 
        loggedIn: false,
        musicasCurtidas: [],
        artistasFavoritos: []
      });
    }
    
    return res.json({ 
      loggedIn: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      },
      musicasCurtidas: usuario.musicasCurtidas || [],
      artistasFavoritos: usuario.artistasFavoritos || []
    });
  },
  home: (req, res) => {
    console.log('Total de músicas no sistema:', musicasGlobal.length);
    
    // Sistema de ranking baseado em engajamento (likes, downloads, plays)
    const calcularScore = (musica) => {
      return (musica.likes * 3) + (musica.downloads * 2) + (musica.plays * 1);
    };
    
    // Músicas mais curtidas (4 cards) - ranking por engajamento
    let musicasEmDestaque = [...musicasGlobal]
      .sort((a, b) => calcularScore(b) - calcularScore(a))
      .slice(0, 4);
    
    // Se não há músicas com engajamento, mostra aleatoriamente
    if (musicasEmDestaque.every(m => calcularScore(m) === 0)) {
      musicasEmDestaque = [...musicasGlobal]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    }
    
    // Músicas recentes (6 cards em 2x3) - as 6 músicas mais recentes do sistema
    let musicasRecentes = [...musicasGlobal]
      .sort((a, b) => {
        // Ordenar por data de adição ou ID se não houver data
        if (a.dataAdicao && b.dataAdicao) {
          return new Date(b.dataAdicao) - new Date(a.dataAdicao);
        }
        return b.id - a.id;
      })
      .slice(0, 6)
      .map(musica => ({
        id: musica.id,
        titulo: musica.nome || musica.titulo,
        artista: musica.artista,
        ano: musica.ano || new Date().getFullYear(),
        imagem: musica.imagem || musica.cover || '/assets/imagens/imagens_musicas/default.jpg',
        categoria: musica.categoria,
        arquivo: musica.arquivo || musica.link,
        plays: musica.plays || 0,
        likes: musica.likes || 0,
        downloads: musica.downloads || 0
      }));
    
    // *** Calcular artistas em destaque baseado APENAS em curtidas das músicas ***
    const artistasComScore = artistasGlobal.map(artista => {
      // Calcular total de curtidas nas músicas do artista
      const musicasDoArtista = musicasGlobal.filter(musica => 
        musica.artista === artista.nome
      );
      const totalLikesMusicasArtista = musicasDoArtista.reduce((total, musica) => 
        total + (musica.likes || 0), 0
      );
      
      // Calcular total de plays nas músicas do artista (só para exibir)
      const totalPlaysMusicasArtista = musicasDoArtista.reduce((total, musica) => 
        total + (musica.plays || 0), 0
      );
      
      return {
        ...artista,
        totalLikes: totalLikesMusicasArtista,
        totalPlays: totalPlaysMusicasArtista,
        totalMusicas: musicasDoArtista.length
      };
    });
    
    // Ordenar APENAS por número de curtidas das músicas e pegar os top 4
    const artistasEmDestaque = artistasComScore
      .filter(artista => artista.totalLikes > 0) // Só artistas com curtidas
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 4);
    
    // Se não há artistas com curtidas, mostrar os 4 primeiros
    const artistasParaExibir = artistasEmDestaque.length > 0 ? 
      artistasEmDestaque : artistasGlobal.slice(0, 4);
    
    console.log('Músicas em destaque:', musicasEmDestaque.length);
    console.log('Músicas recentes:', musicasRecentes.length);
    console.log('Artistas em destaque:', artistasParaExibir.length);
    console.log('Total artistas no sistema:', artistasGlobal.length);
    
    res.render('pages/home', { 
      title: 'VIB Music - Página Inicial',
      musicasEmDestaque: musicasEmDestaque || [],
      musicasRecentes: musicasRecentes || [],
      musicasPorCategoria: [],
      artistas: artistasGlobal || [],
      artistasEmDestaque: artistasParaExibir || []
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
    
    // Artistas do mês - baseado em critérios de destaque
    // 1º critério: ordem de adição (ID menor = adicionado primeiro)
    // 2º critério: engajamento (seguidores + engajamento das músicas)
    const calcularScoreArtista = (artista) => {
      const musicasDoArtista = musicasGlobal.filter(m => m.artista === artista.nome);
      const engajamentoMusicas = musicasDoArtista.reduce((total, musica) => {
        return total + (musica.likes || 0) * 3 + (musica.downloads || 0) * 2 + (musica.plays || 0);
      }, 0);
      return (artista.seguidores || 0) * 5 + engajamentoMusicas;
    };
    
    let artistasDoMes = [...artistasGlobal]
      .map(artista => {
        const quantidadeMusicas = musicasGlobal.filter(m => m.artista === artista.nome).length;
        const scoreEngajamento = calcularScoreArtista(artista);
        
        return {
          ...artista,
          quantidadeMusicas,
          scoreEngajamento,
          // Combinar critérios: ordem de adição (peso maior) + engajamento
          scoreTotal: (1000 - artista.id) * 100 + scoreEngajamento
        };
      })
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, 4);
    
    console.log('=== ARTISTAS DO MÊS (CATEGORIAS) ===');
    console.log('Total artistas disponíveis:', artistasGlobal.length);
    console.log('Artistas do mês selecionados:', artistasDoMes.length);
    
    res.render('pages/categorias', { 
      title: 'Categorias Musicais',
      categorias: categorias,
      artistasDoMes: artistasDoMes
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
        artistas: artistasGlobal.filter(a => a.categoria.toLowerCase().includes('kuduro')).map(artista => ({
          nome: artista.nome,
          imagem: artista.imagem.replace('/assets/imagens/imagens_artistas/', ''),
          musicas: musicasGlobal.filter(m => m.artista === artista.nome).length,
          seguidores: artista.seguidores || 0
        })),
        musicasPopulares: filtrarMusicasPorCategoria('Kuduro')
      },
      'rap': {
        id: 'rap',
        nome: 'Rap/Hip-Hop',
        descricao: 'Música urbana com batidas fortes e letras expressivas',
        descricaoLonga: 'O Rap angolano cresceu significativamente nas últimas décadas, tornando-se uma voz poderosa da juventude urbana. Com letras que abordam questões sociais, políticas e do quotidiano, o hip-hop angolano conquistou um lugar de destaque na música nacional.',
        imagem: 'pesso_com_micro.jpg',
        cor: '#ff0000',
        artistas: artistasGlobal.filter(a => a.categoria.toLowerCase().includes('rap')).map(artista => ({
          nome: artista.nome,
          imagem: artista.imagem.replace('/assets/imagens/imagens_artistas/', ''),
          musicas: musicasGlobal.filter(m => m.artista === artista.nome).length,
          seguidores: artista.seguidores || 0
        })),
        musicasPopulares: filtrarMusicasPorCategoria('Rap')
      },
      'afrohouse': {
        id: 'afrohouse',
        nome: 'Afro House',
        descricao: 'Fusão de house music com ritmos africanos',
        descricaoLonga: 'O Afro House combina a energia da música house electrónica com os ritmos tradicionais africanos, criando uma fusão única que faz dançar. Este género tem ganhado popularidade internacional, com Angola na vanguarda da produção.',
        imagem: 'forca_suprema.jpg',
        cor: '#0051ff',
        artistas: artistasGlobal.filter(a => a.categoria.toLowerCase().includes('afro')).map(artista => ({
          nome: artista.nome,
          imagem: artista.imagem.replace('/assets/imagens/imagens_artistas/', ''),
          musicas: musicasGlobal.filter(m => m.artista === artista.nome).length,
          seguidores: artista.seguidores || 0
        })),
        musicasPopulares: filtrarMusicasPorCategoria('Afro House')
      },
      'semba': {
        id: 'semba',
        nome: 'Semba',
        descricao: 'Música tradicional angolana, precursora da samba',
        descricaoLonga: 'O Semba é um género musical tradicional de Angola, considerado o precursor da samba brasileira. Com ritmos cadenciados e letras que contam histórias do povo angolano, o semba é uma expressão cultural fundamental da identidade nacional.',
        imagem: 'pessoas_com_roupa_vermelha.jpg',
        cor: '#ff8900',
        artistas: artistasGlobal.filter(a => a.categoria.toLowerCase().includes('semba')).map(artista => ({
          nome: artista.nome,
          imagem: artista.imagem.replace('/assets/imagens/imagens_artistas/', ''),
          musicas: musicasGlobal.filter(m => m.artista === artista.nome).length,
          seguidores: artista.seguidores || 0
        })),
        musicasPopulares: filtrarMusicasPorCategoria('Semba')
      },
      'kizomba': {
        id: 'kizomba',
        nome: 'Kizomba',
        descricao: 'Ritmo romântico e sensual de Angola e Cabo Verde',
        descricaoLonga: 'A Kizomba é um género musical e dança que nasceu em Angola na década de 1980. Com influências do semba angolano e do zouk das Antilhas, a kizomba conquistou o mundo com seus ritmos suaves e românticos, perfeitos para dançar a dois.',
        imagem: 'plutonio.jpg',
        cor: '#8b5cf6',
        artistas: artistasGlobal.filter(a => a.categoria.toLowerCase().includes('kizomba')).map(artista => ({
          nome: artista.nome,
          imagem: artista.imagem.replace('/assets/imagens/imagens_artistas/', ''),
          musicas: musicasGlobal.filter(m => m.artista === artista.nome).length,
          seguidores: artista.seguidores || 0
        })),
        musicasPopulares: filtrarMusicasPorCategoria('Kizomba')
      },
      'gheto-zouk': {
        id: 'gheto-zouk',
        nome: 'Gheto Zouk',
        descricao: 'Fusão moderna do zouk com influências urbanas',
        descricaoLonga: 'O Gheto Zouk é uma evolução moderna do zouk tradicional, incorporando elementos urbanos e contemporâneos. Este género representa a nova geração da música angolana, combinando tradição com inovação.',
        imagem: 'ouvindo_musica.png',
        cor: '#10b981',
        artistas: artistasGlobal.filter(a => a.categoria.toLowerCase().includes('zouk')).map(artista => ({
          nome: artista.nome,
          imagem: artista.imagem.replace('/assets/imagens/imagens_artistas/', ''),
          musicas: musicasGlobal.filter(m => m.artista === artista.nome).length,
          seguidores: artista.seguidores || 0
        })),
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
    // Calcular total de plays
    const totalPlays = musicasGlobal.reduce((total, musica) => total + (musica.plays || 0), 0);
    
    // Obter as 5 músicas mais recentes (ordenadas por data de adição ou ID)
    const musicasRecentes = [...musicasGlobal]
      .sort((a, b) => {
        if (a.dataAdicao && b.dataAdicao) {
          return new Date(b.dataAdicao) - new Date(a.dataAdicao);
        }
        return b.id - a.id; // Se não há dataAdicao, ordena por ID
      })
      .slice(0, 5)
      .map(musica => ({
        titulo: musica.nome,
        artista: musica.artista,
        data: musica.dataAdicao ? new Date(musica.dataAdicao).toLocaleDateString('pt-AO') : 'N/A',
        plays: musica.plays || 0
      }));
    
    // Contar categorias únicas
    const categoriasUnicas = [...new Set(musicasGlobal.map(m => m.categoria))];
    
    const stats = {
      totalMusicas: musicasGlobal.length,
      totalArtistas: artistasGlobal.length,
      totalCategorias: categoriasUnicas.length,
      totalPlays: totalPlays > 1000 ? `${Math.round(totalPlays / 1000)}K` : totalPlays.toString(),
      musicasRecentes: musicasRecentes
    };
    
    console.log('=== DASHBOARD STATS ===');
    console.log('Total Músicas:', stats.totalMusicas);
    console.log('Total Artistas:', stats.totalArtistas);
    console.log('Músicas Recentes:', musicasRecentes.length);
    
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
    
    // Extrair lista de artistas únicos das músicas existentes
    const artistasExistentes = [...new Set(musicasGlobal.map(musica => musica.artista))].sort();
    
    console.log('=== ADMIN MÚSICAS ===');
    console.log('Total músicas:', musicasGlobal.length);
    console.log('Artistas existentes:', artistasExistentes);
    
    res.render('admin/musicas', {
      title: 'Gerir Músicas - Admin',
      musicas: musicasFiltradas,
      filtros: { search: search || '', categoria: categoria || '' },
      artistasExistentes: artistasExistentes
    });
  },
  
  adminArtistas: (req, res) => {
    // Usar apenas dados reais do array global
    console.log('=== ADMIN ARTISTAS ===');
    console.log('Total de artistas no array:', artistasGlobal.length);
    console.log('Artistas no array:', artistasGlobal);
    
    // Extrair artistas únicos das músicas existentes
    const artistasUnicos = [];
    const artistasJaAdicionados = new Set();
    
    musicasGlobal.forEach(musica => {
      if (!artistasJaAdicionados.has(musica.artista)) {
        artistasUnicos.push({
          nome: musica.artista,
          categoria: musica.categoria
        });
        artistasJaAdicionados.add(musica.artista);
      }
    });
    
    console.log('=== ARTISTAS ÚNICOS DAS MÚSICAS ===');
    console.log('Total artistas únicos encontrados:', artistasUnicos.length);
    console.log('Artistas únicos:', artistasUnicos);
    
    res.render('admin/artistas', {
      title: 'Gerir Artistas - Admin',
      artistas: artistasGlobal,
      artistasUnicos: artistasUnicos
    });
  },

  addArtista: (req, res) => {
    console.log('=== INÍCIO ADD ARTISTA ===');
    
    const nome = req.body.nome;
    const biografia = req.body.biografia || '';
    
    console.log('Nome do artista selecionado:', nome);
    console.log('Biografia:', biografia);
    
    if (!nome) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome do artista é obrigatório!' 
      });
    }
    
    // Buscar a categoria do artista nas músicas existentes
    const musicaDoArtista = musicasGlobal.find(musica => musica.artista === nome);
    if (!musicaDoArtista) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artista não encontrado nas músicas!' 
      });
    }
    
    const categoria = musicaDoArtista.categoria;
    console.log('Categoria encontrada:', categoria);
    
    // Verificar se o artista já existe
    const artistaExistente = artistasGlobal.find(artista => artista.nome === nome);
    if (artistaExistente) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este artista já possui um perfil!' 
      });
    }
    
    const novoId = Math.max(...artistasGlobal.map(a => a.id), 0) + 1;
    
    let imagemPath = '/assets/imagens/imagens_artistas/default.jpg';
    if (req.files && req.files.artistImage && req.files.artistImage[0]) {
      imagemPath = `/uploads/${req.files.artistImage[0].filename}`;
    }
    
    const novoArtista = {
      id: novoId,
      nome: nome,
      categoria: categoria,
      biografia: biografia,
      imagem: imagemPath,
      seguidores: 0
    };
    
    artistasGlobal.push(novoArtista);
    
    // Salvar no arquivo
    const saved = saveArtistas(artistasGlobal);
    
    console.log('Artista adicionado:', novoArtista);
    console.log('Total artistas:', artistasGlobal.length);
    console.log('Salvo no arquivo:', saved);
    
    if (saved) {
      res.json({ success: true, message: 'Artista adicionado com sucesso!' });
    } else {
      res.status(500).json({ success: false, message: 'Erro ao salvar artista!' });
    }
  },

  deleteArtista: (req, res) => {
    const artistaId = parseInt(req.params.id);
    const index = artistasGlobal.findIndex(a => a.id === artistaId);
    
    console.log('=== TENTANDO REMOVER ARTISTA ===');
    console.log('ID do artista:', artistaId);
    console.log('Índice encontrado:', index);
    console.log('Total antes da remoção:', artistasGlobal.length);
    
    if (index === -1) {
      console.log('Artista não encontrado!');
      return res.status(404).json({ 
        success: false, 
        message: 'Artista não encontrado!' 
      });
    }
    
    // Remover do array
    const artistaRemovido = artistasGlobal.splice(index, 1)[0];
    
    // Salvar no arquivo
    const saved = saveArtistas(artistasGlobal);
    
    console.log('Artista removido:', artistaRemovido.nome);
    console.log('Total após remoção:', artistasGlobal.length);
    console.log('Salvo no arquivo:', saved);
    
    if (saved) {
      res.json({ success: true, message: 'Artista removido com sucesso!' });
    } else {
      res.status(500).json({ success: false, message: 'Erro ao salvar mudanças!' });
    }
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
      const { titulo, artista, categoria, duracao, album, ano } = req.body;
      
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
      
      // Criar nova música com campos de engajamento
      const novaMusica = {
        id: novoId,
        titulo: titulo,
        artista: artista,
        categoria: categoria,
        duracao: duracao,
        album: album || '',
        ano: ano || new Date().getFullYear(),
        link: musicFilePath,
        cover: coverImagePath,
        nomeOriginal: musicFile.originalname, // Guardar nome original
        nomeArquivo: musicFile.filename, // Nome do arquivo no servidor
        // Campos de engajamento
        likes: 0,
        downloads: 0,
        plays: 0,
        dataAdicao: new Date().toISOString()
      };
      
      // Adicionar ao array global
      musicasGlobal.push(novaMusica);
      
      // Salvar no arquivo
      const saved = saveMusicas(musicasGlobal);
      
      console.log('Nova música adicionada:', novaMusica);
      console.log('Salvo no arquivo:', saved);
      
      if (saved) {
        res.json({ success: true, message: 'Música adicionada com sucesso!' });
      } else {
        res.status(500).json({ success: false, message: 'Erro ao salvar música!' });
      }
      
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao adicionar música!' 
      });
    }
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
  

  downloadMusica: (req, res) => {
    const musicaId = parseInt(req.params.id);
    const musica = musicasGlobal.find(m => m.id === musicaId);
    
    if (!musica) {
      return res.status(404).json({ 
        success: false, 
        message: 'Música não encontrada!' 
      });
    }
    
    // Incrementar contador de downloads
    musica.downloads = (musica.downloads || 0) + 1;
    console.log(`Download da música "${musica.titulo}" - Total: ${musica.downloads}`);
    
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
  },

  // Sistema de curtidas
  likeMusica: (req, res) => {
    const musicaId = parseInt(req.params.id);
    const musica = musicasGlobal.find(m => m.id === musicaId);
    
    if (!musica) {
      return res.status(404).json({ 
        success: false, 
        message: 'Música não encontrada!' 
      });
    }
    
    // Verificar se usuário está logado
    const usuario = verificarUsuarioLogado(req);
    
    if (!usuario) {
      return res.json({ 
        success: false, 
        needLogin: true, 
        message: 'Precisa fazer login para curtir músicas!' 
      });
    }
    
    // Verificar se o usuário já curtiu esta música
    if (!usuario.musicasCurtidas) {
      usuario.musicasCurtidas = [];
    }
    
    const jaCurtiu = usuario.musicasCurtidas.includes(musicaId);
    
    if (jaCurtiu) {
      // Descurtir
      usuario.musicasCurtidas = usuario.musicasCurtidas.filter(id => id !== musicaId);
      musica.likes = Math.max((musica.likes || 0) - 1, 0);
      
      // Salvar mudanças
      saveUsuarios(usuariosGlobal);
      saveMusicas(musicasGlobal);
      
      console.log(`${usuario.nome} descurtiu "${musica.titulo}"`);
      
      return res.json({ 
        success: true, 
        liked: false,
        message: 'Música descurtida!', 
        totalLikes: musica.likes 
      });
    } else {
      // Curtir
      usuario.musicasCurtidas.push(musicaId);
      musica.likes = (musica.likes || 0) + 1;
      
      // Salvar mudanças
      saveUsuarios(usuariosGlobal);
      saveMusicas(musicasGlobal);
      
      console.log(`${usuario.nome} curtiu "${musica.titulo}" - Total: ${musica.likes}`);
      
      return res.json({ 
        success: true, 
        liked: true,
        message: 'Música curtida!', 
        totalLikes: musica.likes 
      });
    }
  },

  // Contador de reproduções
  playMusica: (req, res) => {
    const musicaId = parseInt(req.params.id);
    const musica = musicasGlobal.find(m => m.id === musicaId);
    
    if (!musica) {
      return res.status(404).json({ 
        success: false, 
        message: 'Música não encontrada!' 
      });
    }
    
    // Incrementar contador de plays
    musica.plays = (musica.plays || 0) + 1;
    console.log(`Play da música "${musica.titulo}" - Total: ${musica.plays}`);
    
    res.json({ 
      success: true, 
      message: 'Play registrado!', 
      totalPlays: musica.plays 
    });
  },

  // Sistema de seguir artista
  followArtista: (req, res) => {
    const nomeArtista = decodeURIComponent(req.params.artista);
    
    // Verificar se usuário está logado
    const usuario = verificarUsuarioLogado(req);
    
    if (!usuario) {
      return res.json({ 
        success: false, 
        needLogin: true, 
        message: `Precisa fazer login para seguir ${nomeArtista}!` 
      });
    }
    
    // Buscar artista na base de dados
    const artista = artistasGlobal.find(a => a.nome.toLowerCase() === nomeArtista.toLowerCase());
    
    if (!artista) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artista não encontrado!' 
      });
    }
    
    // Verificar se o usuário já segue este artista
    if (!usuario.artistasFavoritos) {
      usuario.artistasFavoritos = [];
    }
    
    const jaSegue = usuario.artistasFavoritos.includes(artista.id);
    
    if (jaSegue) {
      // Parar de seguir
      usuario.artistasFavoritos = usuario.artistasFavoritos.filter(id => id !== artista.id);
      artista.seguidores = Math.max((artista.seguidores || 0) - 1, 0);
      
      // Salvar mudanças
      saveUsuarios(usuariosGlobal);
      saveArtistas(artistasGlobal);
      
      console.log(`${usuario.nome} parou de seguir ${artista.nome}`);
      
      return res.json({ 
        success: true, 
        following: false,
        message: `Você parou de seguir ${artista.nome}!`, 
        totalSeguidores: artista.seguidores 
      });
    } else {
      // Seguir
      usuario.artistasFavoritos.push(artista.id);
      artista.seguidores = (artista.seguidores || 0) + 1;
      
      // Salvar mudanças
      saveUsuarios(usuariosGlobal);
      saveArtistas(artistasGlobal);
      
      console.log(`${usuario.nome} agora segue ${artista.nome} - Total: ${artista.seguidores}`);
      
      return res.json({ 
        success: true, 
        following: true,
        message: `Você agora segue ${artista.nome}!`, 
        totalSeguidores: artista.seguidores 
      });
    }
  },

  // Reproduzir todas as músicas de uma categoria
  playCategoryAll: (req, res) => {
    const categoriaId = req.params.categoria;
    
    console.log(`Reproduzir todas as músicas da categoria: ${categoriaId}`);
    
    // Filtrar músicas por categoria
    const musicasDaCategoria = musicasGlobal.filter(musica => {
      const musicaCategoria = musica.categoria.toLowerCase().replace(/[^a-z]/g, '');
      const targetCategoria = categoriaId.toLowerCase().replace(/[^a-z]/g, '');
      return musicaCategoria === targetCategoria || 
             musicaCategoria.includes(targetCategoria) ||
             targetCategoria.includes(musicaCategoria);
    });
    
    // Incrementar plays de todas as músicas da categoria
    musicasDaCategoria.forEach(musica => {
      musica.plays = (musica.plays || 0) + 1;
    });
    
    // Salvar mudanças
    saveMusicas(musicasGlobal);
    
    console.log(`${musicasDaCategoria.length} músicas reproduzidas da categoria ${categoriaId}`);
    
    res.json({
      success: true,
      message: `Reproduzindo ${musicasDaCategoria.length} músicas da categoria ${categoriaId}`,
      musicasCount: musicasDaCategoria.length
    });
  },

  // Seguir categoria
  followCategory: (req, res) => {
    const categoriaId = req.params.categoria;
    
    // Simular que o usuário não está logado
    const userLoggedIn = false; // Alterar para true quando houver sistema de login
    
    if (!userLoggedIn) {
      return res.json({
        needLogin: true,
        success: false,
        message: 'Você precisa estar logado para seguir categorias. Faça login e tente novamente.'
      });
    }
    
    console.log(`Usuário seguiu a categoria: ${categoriaId}`);
    
    res.json({
      needLogin: false,
      success: true,
      message: `Você agora está seguindo a categoria ${categoriaId}!`
    });
  },

  // Deixar de seguir categoria
  unfollowCategory: (req, res) => {
    const categoriaId = req.params.categoria;
    
    // Simular que o usuário não está logado
    const userLoggedIn = false; // Alterar para true quando houver sistema de login
    
    if (!userLoggedIn) {
      return res.json({
        needLogin: true,
        success: false,
        message: 'Você precisa estar logado para deixar de seguir categorias.'
      });
    }
    
    console.log(`Usuário deixou de seguir a categoria: ${categoriaId}`);
    
    res.json({
      needLogin: false,
      success: true,
      message: `Você deixou de seguir a categoria ${categoriaId}.`
    });
  },

  // Perfil do Artista
  perfilArtista: (req, res) => {
    const nomeArtista = decodeURIComponent(req.params.nome);
    
    // Buscar artista no array global
    const artista = artistasGlobal.find(a => 
      a.nome.toLowerCase() === nomeArtista.toLowerCase()
    );
    
    if (!artista) {
      return res.status(404).render('pages/404', { 
        title: 'Artista não encontrado',
        message: 'O artista solicitado não existe.'
      });
    }
    
    // Buscar todas as músicas do artista
    const musicasDoArtista = musicasGlobal.filter(musica => 
      musica.artista.toLowerCase() === artista.nome.toLowerCase()
    );
    
    // Calcular estatísticas do artista
    const totalPlays = musicasDoArtista.reduce((total, musica) => total + (musica.plays || 0), 0);
    const totalLikes = musicasDoArtista.reduce((total, musica) => total + (musica.likes || 0), 0);
    
    // Estruturar dados do artista para a view
    const perfilCompleto = {
      id: artista.id,
      nome: artista.nome,
      categoria: artista.categoria,
      biografia: artista.biografia,
      imagem: artista.imagem,
      seguidores: artista.seguidores || 0,
      totalMusicas: musicasDoArtista.length,
      totalPlays: totalPlays,
      totalLikes: totalLikes,
      cor: getCorPorCategoria(artista.categoria),
      musicas: musicasDoArtista.map(musica => ({
        id: musica.id,
        titulo: musica.titulo || musica.nome,
        nome: musica.nome || musica.titulo,
        artista: musica.artista,
        categoria: musica.categoria,
        duracao: musica.duracao || '3:30',
        album: musica.album,
        ano: musica.ano,
        link: musica.link,
        cover: musica.cover,
        likes: musica.likes || 0,
        plays: musica.plays || 0,
        downloads: musica.downloads || 0
      }))
    };
    
    console.log(`=== PERFIL DO ARTISTA ===`);
    console.log(`Artista: ${artista.nome}`);
    console.log(`Total de músicas: ${musicasDoArtista.length}`);
    console.log(`Total de plays: ${totalPlays}`);
    
    res.render('pages/artista', {
      title: `${artista.nome} - Perfil`,
      artista: perfilCompleto
    });
  },

  // Reproduzir todas as músicas de um artista
  playArtist: (req, res) => {
    const nomeArtista = decodeURIComponent(req.params.artista);
    
    console.log(`Reproduzir todas as músicas do artista: ${nomeArtista}`);
    
    // Filtrar músicas por artista
    const musicasDoArtista = musicasGlobal.filter(musica => 
      musica.artista.toLowerCase() === nomeArtista.toLowerCase()
    );
    
    // Incrementar plays de todas as músicas do artista
    musicasDoArtista.forEach(musica => {
      musica.plays = (musica.plays || 0) + 1;
    });
    
    // Salvar mudanças
    saveMusicas(musicasGlobal);
    
    console.log(`${musicasDoArtista.length} músicas reproduzidas do artista ${nomeArtista}`);
    
    res.json({
      success: true,
      message: `Reproduzindo ${musicasDoArtista.length} músicas de ${nomeArtista}`,
      musicasCount: musicasDoArtista.length
    });
  }
};

// Função auxiliar para obter cor por categoria
function getCorPorCategoria(categoria) {
  const cores = {
    'kuduro': '#ff6b35',
    'kizomba': '#8b5cf6',
    'semba': '#ff8900',
    'afro house': '#0051ff',
    'gheto zouk': '#10b981'
  };
  
  return cores[categoria.toLowerCase()] || '#8b5cf6';
}

// ====== SISTEMA DE AUTENTICAÇÃO ======

// Arquivo para persistir usuários
const usuariosFile = path.join(dataDir, 'usuarios.json');

// Sistema de sessões em memória
let sessoes = new Map();

// Função para hashear senhas
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'vib_music_salt').digest('hex');
}

// Função para carregar usuários do arquivo
function loadUsuarios() {
  ensureDataDir();
  try {
    if (fs.existsSync(usuariosFile)) {
      const data = fs.readFileSync(usuariosFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
  return [];
}

// Função para salvar usuários no arquivo
function saveUsuarios(usuarios) {
  ensureDataDir();
  try {
    fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    return false;
  }
}

// Carregar usuários ou criar usuários padrão
let usuariosGlobal = loadUsuarios();

// Se não há usuários, criar alguns usuários exemplo
if (usuariosGlobal.length === 0) {
  usuariosGlobal = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@vib.com',
      senha: hashPassword('123456'),
      dataCriacao: new Date().toISOString(),
      artistasFavoritos: [],
      musicasCurtidas: []
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@vib.com',
      senha: hashPassword('senha123'),
      dataCriacao: new Date().toISOString(),
      artistasFavoritos: [],
      musicasCurtidas: []
    },
    {
      id: 3,
      nome: 'Admin VIB',
      email: 'admin@vib.com',
      senha: hashPassword('admin123'),
      dataCriacao: new Date().toISOString(),
      artistasFavoritos: [],
      musicasCurtidas: []
    }
  ];
  saveUsuarios(usuariosGlobal);
  console.log('=== USUÁRIOS CRIADOS ===');
  console.log('joao@vib.com - senha: 123456');
  console.log('maria@vib.com - senha: senha123');
  console.log('admin@vib.com - senha: admin123');
}

// Função para gerar token de sessão
function gerarTokenSessao() {
  return crypto.randomBytes(32).toString('hex');
}

// Função para verificar se usuário está logado
function verificarUsuarioLogado(req) {
  const token = req.headers.authorization || req.body.token || req.query.token;
  
  if (!token) {
    return null;
  }
  
  // Verificar se o token existe nas sessões
  const sessao = sessoes.get(token);
  if (!sessao) {
    return null;
  }
  
  // Buscar dados completos do usuário
  const usuario = usuariosGlobal.find(u => u.id === sessao.usuarioId);
  return usuario;
}

// Função de login
module.exports.loginUser = function(req, res) {
  console.log('=== TENTATIVA DE LOGIN ===');
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }
  
  console.log('Email recebido:', email);
  
  // Buscar usuário por email
  const usuario = usuariosGlobal.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!usuario) {
    console.log('Usuário não encontrado');
    return res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
  
  // Verificar senha
  const senhaHash = hashPassword(password);
  if (usuario.senha !== senhaHash) {
    console.log('Senha incorreta');
    return res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
  
  // Criar sessão
  const tokenSessao = gerarTokenSessao();
  sessoes.set(tokenSessao, {
    usuarioId: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    loginTime: new Date().toISOString()
  });
  
  console.log('Login realizado com sucesso:', usuario.email);
  
  // Retornar sucesso com dados do usuário
  res.json({
    success: true,
    message: 'Login realizado com sucesso!',
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    },
    token: tokenSessao
  });
};

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar senha forte
function isValidPassword(password) {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
}

// Função de cadastro
module.exports.registerUser = function(req, res) {
  console.log('=== TENTATIVA DE CADASTRO ===');
  
  const { nome, email, password, confirmPassword } = req.body;
  
  // Validar campos obrigatórios
  if (!nome || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios'
    });
  }
  
  // Validar nome (mínimo 2 caracteres)
  if (nome.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Nome deve ter pelo menos 2 caracteres'
    });
  }
  
  // Validar email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, insira um email válido'
    });
  }
  
  // Validar senha
  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Senha deve ter pelo menos 6 caracteres'
    });
  }
  
  // Confirmar senha
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'As senhas não coincidem'
    });
  }
  
  console.log('Dados recebidos:', { nome: nome.trim(), email: email.toLowerCase() });
  
  // Verificar se email já existe
  const emailExiste = usuariosGlobal.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExiste) {
    console.log('Email já cadastrado:', email);
    return res.status(409).json({
      success: false,
      message: 'Este email já está cadastrado'
    });
  }
  
  // Criar novo usuário
  const novoId = Math.max(...usuariosGlobal.map(u => u.id), 0) + 1;
  const novoUsuario = {
    id: novoId,
    nome: nome.trim(),
    email: email.toLowerCase(),
    senha: hashPassword(password),
    dataCriacao: new Date().toISOString(),
    artistasFavoritos: [],
    musicasCurtidas: []
  };
  
  // Adicionar à lista global
  usuariosGlobal.push(novoUsuario);
  
  // Salvar no arquivo
  if (saveUsuarios(usuariosGlobal)) {
    console.log('Usuário cadastrado com sucesso:', novoUsuario.email);
    
    // Criar sessão automaticamente
    const tokenSessao = gerarTokenSessao();
    sessoes.set(tokenSessao, {
      usuarioId: novoUsuario.id,
      email: novoUsuario.email,
      nome: novoUsuario.nome,
      loginTime: new Date().toISOString()
    });
    
    // Retornar sucesso
    res.json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      },
      token: tokenSessao
    });
  } else {
    console.error('Erro ao salvar usuário');
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente.'
    });
  }
};


