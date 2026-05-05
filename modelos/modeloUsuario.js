import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email és obligatori'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contrasenya és obligatòria'],
    minlength: 6,
    select: false
  },
  rol: {
  type: String,
  enum: ['usuari', 'editor', 'admin'],
  default: 'usuari'
  },
    foto: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Hashear solo si password es nuevo o modificado
usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.comprovarPassword = function(candidat){
  return bcrypt.compare(candidat, this.password);
};

export default mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);