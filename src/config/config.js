import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    cookieName: 'currentUser'
  },
  mail: {
    host: process.env.MAIL_HOST || '',
    port: Number(process.env.MAIL_PORT) || 587,
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
    from: process.env.MAIL_FROM || 'SoftwareAI <info@softwareai.com.mx>'
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  }
};

export const isProduction = config.nodeEnv === 'production';

export default config;
