import { isProduction } from '../config/config.js';

// Middleware centralizado de errores: traduce errores de negocio y de Mongoose a HTTP.
export const errorHandler = (error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || 'Error interno del servidor';

  if (error.name === 'ValidationError') {
    status = 400;
    message = Object.values(error.errors).map(item => item.message).join('. ');
  }

  if (error.name === 'CastError') {
    status = 400;
    message = 'Identificador invalido';
  }

  if (error.code === 11000) {
    status = 409;
    message = 'Ya existe un registro con esos datos';
  }

  if (status >= 500) {
    console.error(error);
    if (isProduction) {
      message = 'Error interno del servidor';
    }
  }

  res.status(status).json({ status: 'error', message });
};

export default errorHandler;
