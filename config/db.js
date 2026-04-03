import mongoose from "mongoose";
import { config } from "dotenv";

config();
const MONGO_URI =
  "mongodb+srv://jg789:Jgsm1002@cluster0.kyneof5.mongodb.net/FRIENDLY_TRIPS";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
