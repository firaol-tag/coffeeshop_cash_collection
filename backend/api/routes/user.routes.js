import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authRequired, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired, requireAdmin);
router.get('/', userController.list);
router.post('/', userController.create);
router.patch('/:id', userController.update);

export default router;
