import mongoose from "mongoose";

const cervezaSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "El nombre de la cerveza es obligatorio"],
        trim: true
    },
    descripcio: {
        type: String,
        trim: true,
        default: ""
    },
    graduacio: {
        type: Number,
        required: [true, "La graduación es obligatoria"],
        min: [0, "La graduación no puede ser negativa"],
        max: [20, "La graduación no puede superar 20%"]
    },
    tipus: {
        type: String,
        required: [true, "El tipo de cerveza es obligatorio"],
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Cerveza", cervezaSchema);
