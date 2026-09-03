import { Router } from 'express';
import { getMyTickets, cancelTicket } from '../controllers/tickets.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/my-tickets', authenticate, getMyTickets);
router.patch('/:tid/cancel', authenticate, cancelTicket);

export default router;
