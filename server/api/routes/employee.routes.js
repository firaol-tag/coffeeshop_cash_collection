import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { authRequired } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.get('/', employeeController.list);

export default router;
