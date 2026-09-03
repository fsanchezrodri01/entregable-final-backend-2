import { sessionsService } from '../services/sessions.service.js';
import { UserDTO } from '../dto/user.dto.js';
import { generateToken } from '../utils/jwt.js';
import { config, isProduction } from '../config/config.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000,
  sameSite: 'lax',
  secure: isProduction
};

export const register = async (req, res, next) => {
  try {
    const user = await sessionsService.register(req.body);
    res.status(201).json({ status: 'success', payload: new UserDTO(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await sessionsService.login(req.body);
    const token = generateToken(user);

    res.cookie(config.jwt.cookieName, token, COOKIE_OPTIONS);
    res.status(200).json({ status: 'success', message: 'Login correcto' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({ status: 'success', payload: new UserDTO(req.user) });
};

export const logout = (req, res) => {
  res.clearCookie(config.jwt.cookieName);
  res.status(200).json({ status: 'success', message: 'Logout correcto' });
};
