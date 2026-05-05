import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';

async function verificarUsuaris() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connectat a MongoDB...\n');

  // Seleccionem el password explícitament per veure'l
  const usuaris = await Usuario.find().select('+password');

  console.log(`Total usuaris: ${usuaris.length}\n`);
  usuaris.forEach(u => {
    const hashejat = u.password?.startsWith('$2');
    console.log(`Email: ${u.email}`);
    console.log(`  Rol:      ${u.rol}`);
    console.log(`  Password: ${u.password}`);
    console.log(`  Hashejat: ${hashejat ? '✅ SÍ' : '❌ NO — cal arreglar-lo'}`);
    console.log('');
  });

  process.exit(0);
}

verificarUsuaris().catch(err => { console.error(err); process.exit(1); });
