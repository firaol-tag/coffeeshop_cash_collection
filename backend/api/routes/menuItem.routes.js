import { Router } from 'express';
import * as menuItemController from '../controllers/menuItem.controller.js';
import { authRequired } from '../../middleware/auth.js';
import { uploadMenuImageOptional } from '../../middleware/uploadMenuImage.js';

const router = Router();

router.use(authRequired);
router.get('/', menuItemController.list);
router.post('/', uploadMenuImageOptional, menuItemController.create);
router.patch('/:id', menuItemController.update);
router.delete('/:id', menuItemController.remove);

export default router;
