
//logica das rotas
module.exports = {
  home: (req, res) => res.render('pages/home', { title: 'Página Inicial' }),
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
  }
};


