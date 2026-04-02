import { Router } from 'express';
import { listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuItem.controller.js';
import { authRequired, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired);

router.get('/', listMenuItems);
router.post('/', requireAdmin, createMenuItem);
router.put('/:id', requireAdmin, updateMenuItem);
router.delete('/:id', requireAdmin, deleteMenuItem);

export default router;
