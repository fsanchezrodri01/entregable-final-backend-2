import { Router } from 'express';
import { getUsers, changeUserRole } from '../controllers/users.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin'), getUsers);
router.patch('/:uid/role', authenticate, authorizeRoles('admin'), changeUserRole);

export default router;
