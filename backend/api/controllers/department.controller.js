import * as departmentService from '../services/department.service.js';

export async function list(req, res, next) {
  try {
    const rows = await departmentService.listDepartments();
    res.json(rows);
  } catch (e) {
    next(e);
  }
}
