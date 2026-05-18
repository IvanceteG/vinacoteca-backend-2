## 🧰 Scripts útils

```bash
# Carregar TOTES les dades de prova de cop (recomanat):
# 3 usuaris (admin/editor/usuari) + 4 vins + 4 cerveses.
# Es pot executar diverses vegades (esborra i recrea).
node scripts/seed.js

# O crear usuaris individualment:
node scripts/crearAdmin.js     # Crear usuari admin
node scripts/crearEditor.js    # Crear usuari editor
node scripts/crearUsuari.js    # Crear usuari normal
```

## 🔑 Credencials de prova

Després d'executar `node scripts/seed.js`:

| Rol    | Email             | Contrasenya |
| ------ | ----------------- | ----------- |
| Admin  | `admin@api.com`   | `admin123`  |
| Editor | `editor@api.com`  | `editor123` |
| Usuari | `usuari@api.com`  | `usuari123` |