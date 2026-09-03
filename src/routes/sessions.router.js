import { Router } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/sessions.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;
