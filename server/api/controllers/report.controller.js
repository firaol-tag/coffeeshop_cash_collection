import * as reportService from '../services/report.service.js';
import { HttpError } from '../utils/httpError.js';

export async function monthly(req, res, next) {
  try {
    const data = await reportService.monthlyReport(req.query.year, req.query.month);
    res.json(data);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function yearly(req, res, next) {
  try {
    const data = await reportService.yearlyReport(req.query.year);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function topFoods(req, res, next) {
  try {
    const data = await reportService.topFoodsReport(req.query.year, req.query.month);
    res.json(data);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function daily(req, res, next) {
  try {
    const data = await reportService.dailyReport();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
