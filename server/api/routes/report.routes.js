import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authRequired, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired, requireAdmin);
router.get('/monthly', reportController.monthly);
router.get('/yearly', reportController.yearly);
router.get('/top-foods', reportController.topFoods);
router.get('/daily', reportController.daily);

export default router;
