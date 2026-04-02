import fs from 'fs/promises';
import path from 'path';
import * as menuItemService from '../services/menuItem.service.js';
import { HttpError } from '../utils/httpError.js';
import { UPLOADS_DIR } from '../../config/uploads.js';

async function removeUploadedFile(file) {
  if (!file?.filename) return;
  await fs.unlink(path.join(UPLOADS_DIR, file.filename)).catch(() => {});
}

export async function list(_req, res, next) {
  try {
    const rows = await menuItemService.listMenuItems();
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const imageFilename = req.file?.filename ?? null;
    const result = await menuItemService.createMenuItem(req.body, imageFilename);
    res.status(201).json(result);
  } catch (e) {
    await removeUploadedFile(req.file);
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    await menuItemService.updateMenuItem(id, req.body);
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await menuItemService.deleteMenuItem(id);
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    next(e);
  }
}
