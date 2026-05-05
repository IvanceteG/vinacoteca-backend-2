import mongoose from "mongoose";
 
export async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Conectada a la base de datos")
    } catch (error) {
        console.log("Error al conectar con la base de datos:", error);
         process.exit(1);
    }
    
}