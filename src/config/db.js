import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
  if (!config.mongoUrl) {
    console.warn('MONGO_URL no definida: el servidor arranca sin conexion a la base de datos');
    return false;
  }

  try {
    await mongoose.connect(config.mongoUrl);
    console.log('Conectado a MongoDB');
    return true;
  } catch (error) {
    console.error(`No se pudo conectar a MongoDB: ${error.message}`);
    return false;
  }
};

export default connectDB;
