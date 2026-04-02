import { Router } from 'express';
import * as departmentController from '../controllers/department.controller.js';
import { authRequired } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.get('/', departmentController.list);

export default router;
