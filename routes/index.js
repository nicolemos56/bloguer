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

// Admin Routes
router.get('/admin', mainController.adminDashboard);
router.get('/admin/musicas', mainController.adminMusicas);
router.get('/admin/artistas', mainController.adminArtistas);
router.get('/admin/categorias', mainController.adminCategorias);
router.post('/admin/musicas/add', mainController.addMusica);
router.post('/admin/artistas/add', mainController.addArtista);
router.delete('/admin/musicas/:id', mainController.deleteMusica);
router.delete('/admin/artistas/:id', mainController.deleteArtista);

module.exports = router;