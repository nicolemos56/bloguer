# Bloguer - Plataforma de Compartilhamento de Música

Uma aplicação web para compartilhamento, divulgação e descoberta de música. Desenvolvida em Node.js com Express, oferecendo funcionalidades para artistas divulgarem seu trabalho e utilizadores descobrirem novas músicas.

##  Índice

- [Descrição](#descrição)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Rotas e Funcionalidades](#rotas-e-funcionalidades)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Troubleshooting](#troubleshooting)
- [Licença](#licença)

##  Descrição

**Bloguer** é uma plataforma centralizada para a música. Permite que:
- Utilizadores descubram músicas por categoria e artista
- Artistas façam upload de suas músicas e criem perfis
- Admin gerencie conteúdo (músicas, artistas, categorias, pedidos de divulgação)
- Comunidade interaja através de likes, plays, downloads e follows (seguimento)
- Artistas peçam divulgação do seu trabalho com sistema de votação e comprovante de pagamento

##  Requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v14.0.0 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (v6.0.0 ou superior) - Incluído com Node.js
- **Git** (opcional, para clonar o repositório)

Para verificar as versões instaladas:
```bash
node --version
npm --version
```

##  Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/miguelfinda/bloguer.git
cd bloguer
```

Ou, se preferir fazer download direto, extraia o ficheiro do projeto para o seu computador e navegue até à pasta.

### 2. Instale as Dependências

Na pasta raiz do projeto, execute:

```bash
npm install
```

Isto irá instalar todas as dependências listadas no `package.json`:
- **express** (5.1.0) - Framework web
- **ejs** (3.1.10) - Motor de templates
- **express-ejs-layouts** (2.5.1) - Layouts para EJS
- **multer** (2.0.2) - Biblioteca para upload de arquivos

### 3. Estrutura de Diretórios Necessários

A aplicação cria automaticamente os seguintes diretórios na primeira execução:

```
data/              # Arquivos JSON de dados (criado automaticamente)
public/uploads/    # Uploads de ficheiros de música
uploads/           # Uploads adicionais
```

Se quiser criar manualmente:

```bash
mkdir -p data public/uploads uploads
```

##  Como Executar

### Modo de Desenvolvimento

Na pasta raiz do projeto, execute:

```bash
npm start
```

Ou, se preferir rodar Node.js diretamente:

```bash
node server.js
```

Verá uma mensagem similar a:

```
=== CONTROLLER INICIALIZADO ===
Array de artistas inicializado: 4
Servidor rodando em http://0.0.0.0:5000
```

### Aceder à Aplicação

Abra o seu browser e navegue para:

```
http://localhost:5000
```

A aplicação estará disponível com as seguintes páginas:

- **Home**: `http://localhost:5000/`
- **Categorias**: `http://localhost:5000/categorias`
- **Divulgar Música**: `http://localhost:5000/divulgar`
- **Admin Dashboard**: `http://localhost:5000/admin`

### Parar o Servidor

Pressione `Ctrl + C` no terminal onde o servidor está a rodar.

##  Estrutura do Projeto

```
bloguer/
├── controllers/
│   └── mainController.js       # Lógica das rotas e operações
├── routes/
│   └── index.js                # Definição de rotas
├── views/
│   ├── layout.ejs              # Template layout principal
│   ├── admin/                  # Páginas do painel admin
│   │   ├── artistas.ejs
│   │   ├── categorias.ejs
│   │   ├── dashboard.ejs
│   │   ├── musicas.ejs
│   │   └── pedidos.ejs
│   └── pages/                  # Páginas públicas
│       ├── home.ejs
│       ├── categoria.ejs
│       ├── categorias.ejs
│       ├── artista.ejs
│       ├── musica-detalhes.ejs
│       ├── divulgar.ejs
│       ├── 404.ejs
│       └── kuduro.ejs
├── public/
│   ├── assets/
│   │   ├── css/                # Estilos CSS
│   │   ├── js/                 # Scripts JavaScript frontend
│   │   └── imagens/            # Imagens
│   └── uploads/                # Upload de ficheiros
├── data/
│   ├── artistas.json           # Dados de artistas
│   ├── musicas.json            # Dados de músicas
│   ├── usuarios.json           # Dados de utilizadores
│   └── pedidos.json            # Pedidos de divulgação
├── uploads/                    # Diretório de uploads adicionais
├── server.js                   # Ficheiro principal do servidor
├── package.json                # Configuração do projeto e dependências
└── README.md                   # Este ficheiro
```

##  Banco de Dados

A aplicação utiliza **persistência em arquivos JSON** em vez de um banco de dados tradicional. Todos os dados são armazenados em ficheiros na pasta `data/`:

### Estrutura dos Arquivos

#### `artistas.json`
```json
[
  {
    "id": 1,
    "nome": "Anselmo Ralph",
    "categoria": "Kizomba",
    "imagem": "/assets/imagens/imagens_artistas/anselmo-ralph.jpg",
    "seguidores": 1500,
    "musicas": ["Kuzola"]
  }
]
```

#### `musicas.json`
```json
[
  {
    "id": 1,
    "nome": "Kuzola",
    "artista": "Anselmo Ralph",
    "categoria": "Kizomba",
    "ano": 2010,
    "arquivo": "/uploads/musicFile-xxxxx.mp3",
    "imagem": "/assets/imagens/imagens_musicas/kuzola.jpg",
    "plays": 1200,
    "likes": 45,
    "downloads": 89
  }
]
```

#### `usuarios.json`
```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "hashed_password",
    "role": "admin"
  }
]
```

#### `pedidos.json`
```json
[
  {
    "id": 1,
    "artista": "Nome do Artista",
    "titulo": "Título da Música",
    "categoria": "Categoria",
    "status": "pendente",
    "arquivo": "/uploads/xxxxx.mp3",
    "comprovante": "/uploads/comprovante.pdf"
  }
]
```

### Características

-  **Simples e Leve**: Sem necessidade de servidor de banco de dados externo
-  **Fácil de Entender**: Dados em JSON são legíveis e editáveis manualmente
-  **Rápido para Prototipagem**: Ideal para desenvolvimento e protótipos
-  **Limitações**: Sem suporte a transações, concorrência limitada, performance reduzida com grandes volumes de dados

### Fazer Backup dos Dados

Para fazer backup dos dados, copie a pasta `data/`:

```bash
# Windows (PowerShell)
Copy-Item -Path data -Destination data.backup -Recurse

# Linux/Mac
cp -r data data.backup
```

##  Rotas e Funcionalidades

### Rotas Públicas

| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | GET | Página inicial |
| `/categorias` | GET | Lista todas as categorias |
| `/categoria/:id` | GET | Detalhes de uma categoria |
| `/artista/:nome` | GET | Perfil do artista |
| `/musica/:id` | GET | Detalhes da música |
| `/divulgar` | GET | Página para divulgar música |

### Rotas Admin

| Rota | Método | Descrição |
|------|--------|-----------|
| `/admin` | GET | Dashboard do admin |
| `/admin/musicas` | GET | Gerenciar músicas |
| `/admin/artistas` | GET | Gerenciar artistas |
| `/admin/categorias` | GET | Gerenciar categorias |
| `/admin/pedidos` | GET | Ver pedidos de divulgação |
| `/admin/musicas/add` | POST | Adicionar música |
| `/admin/artistas/add` | POST | Adicionar artista |
| `/admin/musicas/:id` | DELETE | Remover música |
| `/admin/artistas/:id` | DELETE | Remover artista |

### Rotas de Engajamento

| Rota | Método | Descrição |
|------|--------|-----------|
| `/like/:id` | POST | Dar like numa música |
| `/play/:id` | POST | Registar play de música |
| `/follow/:artista` | POST | Seguir artista |
| `/download/:id` | GET | Fazer download de música |

### Rotas de Autenticação

| Rota | Método | Descrição |
|------|--------|-----------|
| `/login` | POST | Fazer login |
| `/register` | POST | Registar novo utilizador |
| `/user/state` | GET | Obter estado do utilizador |

### Rotas de API

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/artistas` | GET | Obter lista de artistas (JSON) |
| `/api/sync` | GET | Sincronização em tempo real |
| `/api/divulgacao` | POST | Enviar pedido de divulgação |
| `/api/comprovante-pagamento` | POST | Enviar comprovante de pagamento |
| `/api/pedido/status` | POST | Alterar status de pedido |

##  Funcionalidades Principais

### 1. **Descoberta de Música**
- Navegue por categorias de música
- Veja artistas e seus perfis
- Reproduza visualizações de músicas
- Veja detalhes de cada música

### 2. **Engajamento**
- Dê likes em músicas favoritas
- Siga seus artistas preferidos
- Faça download de músicas
- Veja o histórico de plays

### 3. **Painel Admin**
- Gerencie artistas (adicionar, remover)
- Gerencie músicas (adicionar, remover)
- Gerencie categorias
- Revise e aprove/rejeite pedidos de divulgação

### 4. **Divulgação de Música**
- Artistas podem fazer upload de suas músicas
- Enviar pedidos de divulgação
- Fornecer comprovante de pagamento
- Acompanhar status dos pedidos

### 5. **Upload de Ficheiros**
- Upload de arquivo de música (até 50MB)
- Upload de imagem de capa
- Upload de imagem de perfil do artista
- Upload de comprovante de pagamento

##  Troubleshooting

### "Port 5000 já está em uso"

Se a porta 5000 já estiver em uso, altere a porta no `server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Altere para 3000 ou outra porta
```

Ou execute com uma variável de ambiente:

```bash
# Windows (PowerShell)
$env:PORT = 3000; npm start

# Linux/Mac
PORT=3000 npm start
```

### "Erro ao carregar artistas/músicas"

Verifique se a pasta `data/` existe:

```bash
mkdir -p data
```

Se o problema persistir, delete os arquivos JSON na pasta `data/` e reinicie o servidor. Ele criará dados padrão automaticamente.

### "Erro ao fazer upload de arquivos"

Certifique-se de que as pastas de upload existem:

```bash
mkdir -p public/uploads uploads
```

Verifique permissões de escrita nas pastas.

### "Aplicação muito lenta"

Com muitos dados nos arquivos JSON, a performance pode degradar. Considere:
- Limpar dados antigos
- Migrar para um banco de dados real (MongoDB, PostgreSQL)
- Implementar pagination nas listas

### "Perdi meus dados"

Se restaurou de um backup, copie os ficheiros JSON da pasta de backup:

```bash
# Windows
Copy-Item -Path data.backup\* -Destination data -Recurse -Force

# Linux/Mac
cp data.backup/* data/
```

##  Variáveis de Ambiente

A aplicação suporta as seguintes variáveis de ambiente:

```bash
PORT=5000          # Porta do servidor (padrão: 5000)
NODE_ENV=development # Ambiente (development/production)
```

##  Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

##  Licença

Este projeto está licenciado sob a Licença ISC. Veja o ficheiro `package.json` para mais detalhes.

##  Suporte

Para questões ou problemas, abra um issue no [GitHub](https://github.com/miguelfinda/bloguer/issues).

---

**Desenvolvido por**: Miguel Finda  
**Repositório**: [https://github.com/miguelfinda/bloguer](https://github.com/miguelfinda/bloguer)  
**Versão**: 1.0.0