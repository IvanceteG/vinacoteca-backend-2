import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function enviarCorreuComanda(usuari, comanda) {
  const linies = comanda.linies
    .map(l => `- ${l.tipusProducte} (id: ${l.producte}) x${l.quantitat} — ${l.preuUnitari}€/u`)
    .join('\n');

  await transporter.sendMail({
    from: `"Vinacoteca API" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: `Nova comanda de ${usuari.email}`,
    text: `
Nova comanda rebuda!

Usuari: ${usuari.email}
ID comanda: ${comanda._id}
Estat: ${comanda.estat}
Total: ${comanda.total}€

Línies:
${linies}

Adreça: ${comanda.adreca || 'No especificada'}
Notes: ${comanda.notes || 'Cap'}
    `.trim()
  });
}
