import { Router } from 'express';
import { listMenus, createMenu, updateMenu, deleteMenu } from '../controllers/menu.controller.js';
import { authRequired, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired);

router.get('/', listMenus);
router.post('/', requireAdmin, createMenu);
router.put('/:id', requireAdmin, updateMenu);
router.delete('/:id', requireAdmin, deleteMenu);

export default router;