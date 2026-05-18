import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuario.js';
import Vino from '../modelos/modeloVinos.js';
import Cerveza from '../modelos/modeloCervezas.js';

// ─────────────────────────────────────────────────────────────────
// Script de SEED: carrega dades de prova per a l'IA3.
// Es pot executar diverses vegades sense error (esborra i recrea).
//   Ús:  node scripts/seed.js
// ─────────────────────────────────────────────────────────────────

const USUARIS = [
  { email: 'admin@api.com',  password: 'admin123',  rol: 'admin'  },
  { email: 'editor@api.com', password: 'editor123', rol: 'editor' },
  { email: 'usuari@api.com', password: 'usuari123', rol: 'usuari' }
];

const VINS = [
  { nom: 'Rioja Reserva 2018',     descripcio: 'Negre amb cos, criança en barrica de roure.', graduacio: 14,   tipus: 'Negre' },
  { nom: 'Albariño Rías Baixas',   descripcio: 'Blanc fresc i afruitat, ideal amb marisc.',    graduacio: 12.5, tipus: 'Blanc' },
  { nom: 'Cava Brut Nature',       descripcio: 'Escumós sec elaborat amb mètode tradicional.',  graduacio: 11.5, tipus: 'Escumós' },
  { nom: 'Ribera del Duero Crianza', descripcio: 'Negre potent amb notes de fruita madura.',   graduacio: 14.5, tipus: 'Negre' }
];

const CERVESES = [
  { nom: 'IPA Artesana',      descripcio: 'Amarga i aromàtica, llúpol americà.',       graduacio: 6.2, tipus: 'IPA' },
  { nom: 'Lager Pilsen',      descripcio: 'Daurada, lleugera i refrescant.',           graduacio: 4.8, tipus: 'Lager' },
  { nom: 'Stout Imperial',    descripcio: 'Negra intensa amb notes de cafè i xocolata.', graduacio: 8.5, tipus: 'Stout' },
  { nom: 'Weissbier de Blat', descripcio: 'De blat, tèrbola, amb notes de plàtan.',     graduacio: 5.4, tipus: 'Weissbier' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connectat a MongoDB');

  // ── Usuaris ──────────────────────────────────────────
  for (const dades of USUARIS) {
    await Usuario.deleteOne({ email: dades.email });
    const u = await Usuario.create(dades);   // el pre('save') hasheja la contrasenya
    console.log(`👤 Usuari creat: ${u.email} (${u.rol})`);
  }

  // ── Vins ─────────────────────────────────────────────
  await Vino.deleteMany({});
  const vinsCreats = await Vino.insertMany(VINS);
  console.log(`🍷 ${vinsCreats.length} vins creats`);

  // ── Cerveses ─────────────────────────────────────────
  await Cerveza.deleteMany({});
  const cervesesCreades = await Cerveza.insertMany(CERVESES);
  console.log(`🍺 ${cervesesCreades.length} cerveses creades`);

  console.log('\n✅ SEED completat. Credencials de prova:');
  console.log('   admin@api.com  / admin123  (admin)');
  console.log('   editor@api.com / editor123 (editor)');
  console.log('   usuari@api.com / usuari123 (usuari)');

  process.exit(0);
}

seed().catch(err => { console.error('❌ Error al seed:', err); process.exit(1); });
