import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';

async function crearEditor() {
  await mongoose.connect(process.env.MONGO_URI);
  const editor = await Usuario.create({
    email: 'editor@api.com',
    password: 'editor123',
    rol: 'editor'
  });
  console.log('Editor creat:', editor.email);
  process.exit(0);
}
crearEditor().catch(err => { console.error(err); process.exit(1); });