import jwt from 'jsonwebtoken';
import Usuario from '../modelos/modeloUsuario.js';

// Middleware: comprova el token JWT i carrega l'usuari a req.usuari per a les rutes següents
const protegir = async (req, res, next) => {
  let token = null;
  // Llegir token de l'header Authorization: "Bearer <token>"
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'No autoritzat: token absent' });
  }
  try {
    // Verificar signatura i caducitat; decoded conté el payload (p. ex. { id })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuari = await Usuario.findById(decoded.id);
    if (!req.usuari) {
      return res.status(401).json({ error: 'Usuari no vàlid' });
    }
    next();  // Token vàlid: continuar cap al controlador
  } catch (err) {
    return res.status(401).json({ error: 'Token no vàlid o expirat' });
  }
};

const autoritzar = (...rols) => {
  return (req, res, next) => {
    // Si per error s'usa sense protegir, no hi haurà usuari
    if (!req.usuari) {
      return res.status(401).json({ error: 'No autenticat' });
    }
    // Si el rol de l'usuari no és un dels permesos, 403 Forbidden (sabem qui és, però no té permís)
    if (!rols.includes(req.usuari.rol)) {
      return res.status(403).json({
        error: 'No tens permís per realitzar aquesta acció',
        rol: req.usuari.rol,
        rolsPermesos: rols
      });
    }
    next();  // Rol correcte: continuar cap al controlador
  };
};

export { protegir, autoritzar };