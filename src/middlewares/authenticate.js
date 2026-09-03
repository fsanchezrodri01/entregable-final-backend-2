import passport from 'passport';
import { unauthorized } from '../utils/httpError.js';

// Autenticacion por JWT en cookie. Debe ejecutarse antes de cualquier autorizacion.
export const authenticate = (req, res, next) => {
  passport.authenticate('current', { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return next(unauthorized('No autenticado'));
    }

    req.user = user;
    return next();
  })(req, res, next);
};

// Deja req.user si hay sesion valida, pero no bloquea si no la hay.
export const optionalAuthenticate = (req, res, next) => {
  passport.authenticate('current', { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (user) {
      req.user = user;
    }

    return next();
  })(req, res, next);
};

export default authenticate;
