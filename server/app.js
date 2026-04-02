import express from 'express';
import cors from 'cors';

import { ensureUploadsDir, UPLOADS_DIR } from './config/uploads.js';
import pool from './config/db.js';
import authRoutes from './api/routes/auth.routes.js';
import departmentRoutes from './api/routes/department.routes.js';
import userRoutes from './api/routes/user.routes.js';
import menuRoutes from './api/routes/menu.routes.js';
import menuItemRoutes from './api/routes/menuItem.routes.js';
import foodRoutes from './api/routes/food.routes.js';
import bookingRoutes from './api/routes/booking.routes.js';
import reportRoutes from './api/routes/report.routes.js';
import employeeRoutes from './api/routes/employee.routes.js';

export function createApp() {
  ensureUploadsDir();

  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use('/uploads', express.static(UPLOADS_DIR));

  app.get('/api/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      console.log("database connected")
      res.json({ ok: true, database: 'connected' });
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ ok: false, database: 'disconnected', error: err.message });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/menus', menuRoutes);
  app.use('/api/menu-items', menuItemRoutes);
  app.use('/api/foods', foodRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/employees', employeeRoutes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
