import * as authService from '../services/auth.service.js';
import { HttpError } from '../utils/httpError.js';

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body?.email, req.body?.password);
    res.json(result);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) {
    next(e);
  }
}
