import { Router } from 'express';
import { getCurrent } from '../controllers/sessions.controller.js';

const router = Router();

router.get('/current', getCurrent);

export default router;
