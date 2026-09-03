import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { sessionsService } from '../services/sessions.service.js';
import { config } from './config.js';

// El JWT viaja en una cookie httpOnly, no en los headers.
const cookieExtractor = req => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies[config.jwt.cookieName];
  }

  return token;
};

export const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          const user = await sessionsService.register({ first_name, last_name, email, password });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await sessionsService.login({ email, password });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'current',
    new JwtStrategy(
      { jwtFromRequest: cookieExtractor, secretOrKey: config.jwt.secret },
      async (jwtPayload, done) => {
        try {
          // El token identifica; la base confirma que el usuario sigue siendo valido.
          const user = await sessionsService.getById(jwtPayload.id);

          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  return passport;
};

export default initializePassport;
