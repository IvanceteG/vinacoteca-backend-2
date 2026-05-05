import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';

async function crearUsuari() {
  await mongoose.connect(process.env.MONGO_URI);

  // Esborra si ja existia (per evitar duplicats)
  await Usuario.deleteOne({ email: 'usuari@api.com' });

  const usuari = await Usuario.create({
    email: 'usuari@api.com',
    password: 'usuari123',
    rol: 'usuari'
  });

  console.log('Usuari normal creat:', usuari.email, '| rol:', usuari.rol);
  process.exit(0);
}

crearUsuari().catch(err => { console.error(err); process.exit(1); });
