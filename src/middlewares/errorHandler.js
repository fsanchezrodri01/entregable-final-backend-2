export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ status: 'error', error: error.message || 'Error interno del servidor' });
};

export default errorHandler;
