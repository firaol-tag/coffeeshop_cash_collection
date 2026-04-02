import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authRequired, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired, requireAdmin);
router.get('/monthly', reportController.monthly);
router.get('/yearly', reportController.yearly);

export default router;
