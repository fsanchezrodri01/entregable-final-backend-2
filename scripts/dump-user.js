/**
 * Muestra un documento crudo de la coleccion users para evidenciar que la
 * contrasena esta hasheada en la base de datos.
 */
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';

const connected = await connectDB();

if (!connected) {
  console.log('{ "error": "sin conexion a MongoDB" }');
  process.exit(0);
}

const doc = await mongoose.connection
  .collection('users')
  .findOne({ email: 'admin@softwareai.com.mx' });

console.log(JSON.stringify(doc, null, 2));

await mongoose.disconnect();
