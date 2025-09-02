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


module.exports = router;