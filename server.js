
const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
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

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limite
  }
});

// Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layout');
app.set('views', path.join(__dirname, 'views'));

// Configuração de sessões
app.use(session({
  secret: 'vib-music-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true apenas para HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para tornar usuário disponível em todas as views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isLoggedIn = !!req.session.user;
  next();
});

// Middleware para parsing de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar multer para uploads
app.use('/admin/musicas/add', upload.fields([
  { name: 'musicFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]));

app.use('/admin/artistas/add', upload.fields([
  { name: 'artistImage', maxCount: 1 }
]));

// Rotas
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
