import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';

// Script per netejar usuaris amb password en text pla i recrear-los correctament
async function resetUsuaris() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connectat a MongoDB...');

  // Esborra tots els usuaris de prova per evitar conflictes
  await Usuario.deleteMany({
    email: { $in: ['admin@api.com', 'editor@api.com', 'usuari@api.com', 'ivangarcia@example.com'] }
  });
  console.log('Usuaris antics esborrats.');

  // Crea els 3 rols amb password hashejada correctament via pre('save')
  const admin = await Usuario.create({ email: 'admin@api.com', password: 'admin123', rol: 'admin' });
  console.log('✅ Admin creat:', admin.email, '| password hashejada:', admin.password.startsWith('$2'));

  const editor = await Usuario.create({ email: 'editor@api.com', password: 'editor123', rol: 'editor' });
  console.log('✅ Editor creat:', editor.email, '| password hashejada:', editor.password.startsWith('$2'));

  const usuari = await Usuario.create({ email: 'usuari@api.com', password: 'usuari123', rol: 'usuari' });
  console.log('✅ Usuari creat:', usuari.email, '| password hashejada:', usuari.password.startsWith('$2'));

  console.log('\n--- Credencials de prova ---');
  console.log('Admin:   admin@api.com   / admin123');
  console.log('Editor:  editor@api.com  / editor123');
  console.log('Usuari:  usuari@api.com  / usuari123');

  process.exit(0);
}

resetUsuaris().catch(err => { console.error(err); process.exit(1); });
