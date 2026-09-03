import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = user =>
  jwt.sign(
    { id: user.id ?? user._id?.toString(), email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

export const verifyToken = token => jwt.verify(token, config.jwt.secret);
