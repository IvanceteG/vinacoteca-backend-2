# 🍷 Vinacoteca — Backend API

API REST construïda amb Node.js + Express + MongoDB. Gestió de productes (vins i cerveses), usuaris amb rols, comandes amb notificació per correu i pujada d'imatges.

## 🛠️ Stack

- Node.js + Express 5
- MongoDB Atlas + Mongoose
- JWT (autenticació)
- Bcrypt (hash de contrasenyes)
- Multer (pujada d'arxius)
- Nodemailer (correu)
- CORS

## 📋 Requisits

- Node.js 18+
- Compte de MongoDB Atlas amb cluster
- Compte de correu amb SMTP (p. ex. Gmail amb contrasenya d'aplicació)

## 🚀 Instal·lació

```bash
git clone <url-del-repo>
cd vinacoteca-backend
npm install
```

## 🔐 Variables d'entorn

Crea un fitxer `.env` a l'arrel basant-te en `.env.example`:

| Variable        | Descripció                                       |
| --------------- | ------------------------------------------------ |
| `MONGO_URI`     | Cadena de connexió a MongoDB Atlas               |
| `PORT`          | Port del servidor (default 3001)                 |
| `FRONTEND_URL`  | URL del frontend (per al CORS)                   |
| `JWT_SECRET`    | Cadena secreta per signar els tokens JWT         |
| `MAIL_HOST`     | Servidor SMTP (p. ex. `smtp.gmail.com`)          |
| `MAIL_PORT`     | Port SMTP (587 per a TLS)                        |
| `MAIL_USER`     | Usuari SMTP                                      |
| `MAIL_PASS`     | Contrasenya o app-password SMTP                  |
| `MAIL_TO`       | Destinatari de notificacions de comanda          |

## ▶️ Execució

```bash
# Desenvolupament (amb nodemon)
npm run dev

# Producció
npm start
```

Servidor a `http://localhost:3001`.

## 📚 Endpoints principals

### Públic

| Mètode | Ruta                  | Descripció                |
| ------ | --------------------- | ------------------------- |
| GET    | `/api`                | Info de l'API             |
| GET    | `/health`             | Health check              |
| GET    | `/api/vinos`          | Llistat de vins           |
| GET    | `/api/vinos/:id`      | Detall de vi              |
| GET    | `/api/cervezas`       | Llistat de cerveses       |
| GET    | `/api/cervezas/:id`   | Detall de cervesa         |

### Auth

| Mètode | Ruta                   | Descripció                          |
| ------ | ---------------------- | ----------------------------------- |
| POST   | `/api/auth/registro`   | Registre amb foto (multipart)       |
| POST   | `/api/auth/login`      | Login → retorna JWT                 |
| GET    | `/api/auth/perfil`     | Perfil de l'usuari autenticat       |
| PUT    | `/api/auth/perfil`     | Actualitzar perfil (multipart)      |

### Productes (editor o admin)

| Mètode | Ruta                  | Permís          |
| ------ | --------------------- | --------------- |
| POST   | `/api/vinos`          | editor / admin  |
| PUT    | `/api/vinos/:id`      | editor / admin  |
| DELETE | `/api/vinos/:id`      | editor / admin  |
| POST   | `/api/cervezas`       | editor / admin  |
| PUT    | `/api/cervezas/:id`   | editor / admin  |
| DELETE | `/api/cervezas/:id`   | editor / admin  |

### Comandes

| Mètode | Ruta                          | Permís              |
| ------ | ----------------------------- | ------------------- |
| POST   | `/api/comandes`               | Usuari autenticat   |
| GET    | `/api/comandes/me`            | Usuari autenticat   |
| GET    | `/api/comandes`               | Admin               |
| PATCH  | `/api/comandes/:id/estat`     | Admin               |

### Usuaris (només admin)

| Mètode | Ruta                       | Descripció            |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/usuaris`             | Llistar usuaris       |
| PATCH  | `/api/usuaris/:id/rol`     | Canviar rol           |
| DELETE | `/api/usuaris/:id`         | Eliminar usuari       |

## 🗂️ Estructura

```
vinacoteca-backend/
├── config/
│   └── db.js                  # Connexió a MongoDB
├── controlador/
│   ├── controladorCervezas.js
│   ├── controladorVinos.js
│   └── controladorComandes.js
├── middlewares/
│   ├── authMiddleware.js      # protegir + autoritzar
│   └── upload.js              # Multer
├── modelos/
│   ├── modeloUsuario.js
│   ├── modeloCervezas.js
│   ├── modeloVinos.js
│   └── modeloComanda.js
├── routes/
│   ├── authRoutes.js
│   ├── routerCervezas.js
│   ├── routerVinos.js
│   ├── routerComandes.js
│   └── routerUsuaris.js
├── scripts/                   # Scripts d'ajuda (crear admin, etc.)
├── services/
│   └── mailService.js         # Nodemailer
├── uploads/                   # Imatges pujades (ignorat al .gitignore)
├── server.js                  # Punt d'entrada
└── api-pruebas.http           # Proves manuals (REST Client)
```

## 🛡️ Permisos per rol

| Acció                          | Públic | Usuari | Editor | Admin |
| ------------------------------ | :----: | :----: | :----: | :---: |
| Veure productes                | ✅     | ✅     | ✅     | ✅    |
| Registrar-se / login           | ✅     | ✅     | ✅     | ✅    |
| Fer comandes                   | ❌     | ✅     | ✅     | ✅    |
| CRUD productes                 | ❌     | ❌     | ✅     | ✅    |
| Llistar/modificar usuaris      | ❌     | ❌     | ❌     | ✅    |
| Canviar rols d'usuaris         | ❌     | ❌     | ❌     | ✅    |

## 🧰 Scripts útils

```bash
node scripts/crearAdmin.js     # Crear usuari admin
node scripts/crearEditor.js    # Crear usuari editor
node scripts/crearUsuari.js    # Crear usuari normal
```

## 🧪 Proves manuals

Al fitxer `api-pruebas.http` hi ha exemples per provar tots els endpoints amb la extensió **REST Client** de VS Code.

Ordre recomanat:
1. Login com a admin → copiar token
2. Crear productes
3. Login com a usuari → fer comanda
4. Verificar que arriba el correu

## 🌐 Desplegament

Recomanat: Render, Railway o similar. Variables d'entorn necessàries al panell del servei (totes les del `.env.example`). Important:

- `FRONTEND_URL` ha d'apuntar al domini real del frontend (sense barra final).
- `MONGO_URI` amb usuari i contrasenya reals; afegeix `0.0.0.0/0` a Network Access d'Atlas o l'IP del proveïdor.
- A Atlas, crea l'usuari de BD amb permisos `readWrite` sobre la BD `vinacoteca`.
