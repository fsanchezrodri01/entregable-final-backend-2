import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import router from './routes/index.js';
import { initializePassport } from './config/passport.config.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;
