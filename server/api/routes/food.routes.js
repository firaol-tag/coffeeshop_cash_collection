import { Router } from 'express';
import * as foodController from '../controllers/food.controller.js';
import { authRequired } from '../../middleware/auth.js';
import { uploadMenuImageOptional } from '../../middleware/uploadMenuImage.js';

const router = Router();

router.use(authRequired);
router.get('/', foodController.list);
router.post('/', uploadMenuImageOptional, foodController.create);
router.patch('/:id', foodController.update);
router.delete('/:id', foodController.remove);

export default router;
