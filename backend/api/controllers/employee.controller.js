import * as employeeService from '../services/employee.service.js';

export async function list(req, res, next) {
  try {
    const rows = await employeeService.listEmployeesForPos(req.query.q);
    res.json(rows);
  } catch (e) {
    next(e);
  }
}
