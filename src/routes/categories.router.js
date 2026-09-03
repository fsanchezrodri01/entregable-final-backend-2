import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, authorizeRoles('admin'), createCategory);
router.put('/:cid', authenticate, authorizeRoles('admin'), updateCategory);
router.delete('/:cid', authenticate, authorizeRoles('admin'), deleteCategory);

export default router;
