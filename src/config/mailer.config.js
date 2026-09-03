import nodemailer from 'nodemailer';
import { config } from './config.js';

// Sin MAIL_HOST configurado no se crea transporte: los correos se registran en consola.
export const transporter = config.mail.host
  ? nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: config.mail.user ? { user: config.mail.user, pass: config.mail.pass } : undefined
    })
  : null;

export const isMailEnabled = Boolean(transporter);

export default transporter;
