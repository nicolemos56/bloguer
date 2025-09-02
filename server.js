
const express = require('express');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layout');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsing de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
