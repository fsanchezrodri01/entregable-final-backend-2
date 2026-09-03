import app from './app.js';
import { config } from './config/config.js';
import { connectDB } from './config/db.js';

await connectDB();

app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port} [${config.nodeEnv}]`);
});
