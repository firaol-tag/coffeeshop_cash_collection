import * as bookingService from '../services/booking.service.js';
import { HttpError } from '../utils/httpError.js';

export async function list(req, res, next) {
  try {
    const rows = await bookingService.listBookings(req.query);
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const result = await bookingService.createBooking(req.body, req.user.id);
    res.status(201).json(result);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function updatePayment(req, res, next) {
  try {
    const id = Number(req.params.id);
    await bookingService.updateCreditPaymentStatus(id, req.body?.payment_status);
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}
