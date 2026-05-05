import mongoose from "mongoose";

const vinoSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "El nombre del vino es obligatorio"],
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
        max: [25, "La graduación no puede superar 25%"]
    },
    tipus: {
        type: String,
        required: [true, "El tipo de vino es obligatorio"],
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Vino", vinoSchema);
