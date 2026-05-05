import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';

async function arreglarPasswords() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connectat a MongoDB...\n');

  // Usuaris amb password en text pla que cal re-hashear
  const aArreglar = [
    { email: 'ivangarcia@example1.com', password: 'admin1234' },
    { email: 'ivangarcia@example2.com', password: 'admin1234' },
    { email: 'ivangarcia@example3.com', password: 'admin1234' },
  ];

  for (const { email, password } of aArreglar) {
    const usuari = await Usuario.findOne({ email }).select('+password');
    if (!usuari) {
      console.log(`⚠️  No trobat: ${email}`);
      continue;
    }
    // Assignar el password en text pla — el pre('save') l'hashejarà automàticament
    usuari.password = password;
    await usuari.save();
    console.log(`✅ ${email} — password hashejada correctament`);
  }

  console.log('\nFet! Ara pots fer login amb:');
  aArreglar.forEach(u => console.log(`  ${u.email}  /  ${u.password}`));

  process.exit(0);
}

arreglarPasswords().catch(err => { console.error(err); process.exit(1); });
