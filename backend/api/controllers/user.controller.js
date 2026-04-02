import * as userService from '../services/user.service.js';
import { HttpError } from '../utils/httpError.js';

export async function list(req, res, next) {
  try {
    const rows = await userService.listUsers();
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    await userService.updateUser(id, req.body);
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}
