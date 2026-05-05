import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';

// Script per crear un usuari admin (només desenvolupament; la contrasenya es hasheja amb pre('save'))
async function crearAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Usuario.create({
    email: 'admin@api.com',
    password: 'admin123',
    rol: 'admin'
  });
  console.log('Admin creat:', admin.email);
  process.exit(0);
}
crearAdmin().catch(err => { console.error(err); process.exit(1); });