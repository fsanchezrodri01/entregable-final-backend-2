import { forbidden, unauthorized } from '../utils/httpError.js';

// Autorizacion por rol: 401 si no hay usuario, 403 si el rol no esta permitido.
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(unauthorized('No autenticado'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(forbidden('No tienes permisos para realizar esta accion'));
  }

  return next();
};

export default authorizeRoles;
