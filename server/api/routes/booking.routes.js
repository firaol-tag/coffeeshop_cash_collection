import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authRequired } from '../../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.get('/', bookingController.list);
router.post('/', bookingController.create);
router.patch('/:id/payment', bookingController.updatePayment);

export default router;
