
const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

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

// Configurar multer globalmente
app.use('/admin/musicas/add', upload.fields([
  { name: 'musicFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]));

// Rotas
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
