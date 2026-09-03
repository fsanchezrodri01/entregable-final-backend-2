export const notFound = (req, res) => {
  res.status(404).json({ status: 'error', error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

export default notFound;
