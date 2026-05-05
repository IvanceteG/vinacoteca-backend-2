import mongoose from "mongoose";

// Línia individual dins d'una comanda: un producte (vi o cervesa) amb quantitat i preu capturat
const liniaSchema = new mongoose.Schema({
    tipusProducte: {
        type: String,
        required: true,
        enum: ["Vino", "Cerveza"]
    },
    producte: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref dinàmica: apunta a "Vino" o "Cerveza" segons tipusProducte
        refPath: "linies.tipusProducte"
    },
    quantitat: {
        type: Number,
        required: [true, "La quantitat és obligatòria"],
        min: [1, "La quantitat mínima és 1"]
    },
    preuUnitari: {
        type: Number,
        required: [true, "El preu unitari és obligatori"],
        min: [0, "El preu no pot ser negatiu"]
    }
}, { _id: false });

const comandaSchema = new mongoose.Schema({
    usuari: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: [true, "La comanda ha de tenir un usuari associat"]
    },
    linies: {
        type: [liniaSchema],
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: "La comanda ha de tenir almenys una línia"
        }
    },
    estat: {
        type: String,
        enum: ["pendent", "confirmada", "enviada", "entregada", "cancel·lada"],
        default: "pendent"
    },
    total: {
        type: Number,
        min: [0, "El total no pot ser negatiu"],
        default: 0
    },
    adreca: {
        type: String,
        trim: true,
        default: ""
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true });

// Calcular el total automàticament abans de guardar
comandaSchema.pre("save", function () {
    this.total = this.linies.reduce(
        (acc, l) => acc + l.quantitat * l.preuUnitari, 0
    );
});

export default mongoose.model("Comanda", comandaSchema);
