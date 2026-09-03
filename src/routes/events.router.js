import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  changeEventStatus
} from '../controllers/events.controller.js';
import { createTicket, getEventTickets } from '../controllers/tickets.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = Router();

// El listado es publico, pero si hay sesion el service amplia lo que se puede ver.
router.get('/', optionalAuthenticate, getEvents);
router.get('/:eid', getEventById);

router.post('/', authenticate, authorizeRoles('organizer', 'admin'), createEvent);
router.put('/:eid', authenticate, authorizeRoles('organizer', 'admin'), updateEvent);
router.patch('/:eid/status', authenticate, authorizeRoles('organizer', 'admin'), changeEventStatus);

// Inscripciones que cuelgan del curso.
router.post('/:eid/tickets', authenticate, createTicket);
router.get('/:eid/tickets', authenticate, authorizeRoles('organizer', 'admin'), getEventTickets);

export default router;
