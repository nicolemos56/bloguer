//Routas da aplicação
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home);//exemplo de rota para a página inicial

router.get('/divulgar', function(req, res) {
  res.render('pages/divulgar', { title: 'Divulgar' });//exemplo de renderização da página divulgar
});

router.get('/categorias', mainController.categorias);
router.get('/categoria/:id', mainController.categoriaIndividual);
router.get('/artista/:nome', mainController.perfilArtista);

// Admin Routes
router.get('/admin', mainController.adminDashboard);
router.get('/admin/musicas', mainController.adminMusicas);
router.get('/admin/artistas', mainController.adminArtistas);
router.get('/admin/categorias', mainController.adminCategorias);
router.post('/admin/musicas/add', mainController.addMusica);
router.post('/admin/artistas/add', mainController.addArtista);
router.delete('/admin/musicas/:id', mainController.deleteMusica);
router.delete('/admin/artistas/:id', mainController.deleteArtista);

// Rota para download com nome original
router.get('/download/:id', mainController.downloadMusica);

// Rotas de engajamento
router.post('/like/:id', mainController.likeMusica);
router.post('/play/:id', mainController.playMusica);
router.post('/follow/:artista', mainController.followArtista);
router.post('/play-category/:categoria', mainController.playCategoryAll);
router.post('/follow-category/:categoria', mainController.followCategory);
router.post('/unfollow-category/:categoria', mainController.unfollowCategory);
router.post('/play-artist/:artista', mainController.playArtist);

// ==================== ROTAS DE AUTENTICAÇÃO ====================
// Páginas de autenticação
router.get('/auth/login', mainController.loginPage);
router.get('/auth/register', mainController.registerPage);

// Processamento de autenticação
router.post('/auth/login', mainController.processLogin);
router.post('/auth/register', mainController.processRegister);
router.post('/auth/logout', mainController.logout);

// Funcionalidades que requerem login
router.post('/api/follow-artist', mainController.followArtist);

module.exports = router;