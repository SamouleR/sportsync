import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import eventsRoutes from './routes/events.routes.js';
import statsRoutes from './routes/stats.routes.js';
import trainingsRoutes from './routes/trainings.routes.js';
import matchesRoutes from './routes/matches.routes.js';
import medicalRoutes from './routes/medical.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===========================================
// ============= API ROUTES ==================
// ===========================================

// Auth (login, register, 2FA)
app.use('/api/auth', authRoutes);

// Users CRUD (players, coaches, admins)
app.use('/api/users', usersRoutes);

// Legacy events endpoint (kept for backwards compatibility)
app.use('/api/events', eventsRoutes);

// Trainings (full CRUD + responses + chat)
app.use('/api/trainings', trainingsRoutes);

// Matches (CRUD + convocations + lineup + live)
app.use('/api/matches', matchesRoutes);

// Stats (player performance analytics)
app.use('/api/stats', statsRoutes);

// Medical (injury reports, infirmary)
app.use('/api/medical', medicalRoutes);

// Notifications (alerts, read/unread)
app.use('/api/notifications', notificationsRoutes);

// ===========================================
// ========== HEALTH CHECK ===================
// ===========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SportSync API is running!',
    version: '2.0.0',
    endpoints: [
      '/api/auth', '/api/users', '/api/trainings',
      '/api/matches', '/api/stats', '/api/medical',
      '/api/notifications'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n  ⚽ SportSync API v2.0`);
  console.log(`  🚀 Server is running on http://localhost:${PORT}`);
  console.log(`  📊 Health check: http://localhost:${PORT}/api/health\n`);
});
