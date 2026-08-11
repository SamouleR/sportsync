import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
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
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// ===========================================
// ============= SOCKET.IO ===================
// ===========================================
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];

export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Nouveau client connecté: ${socket.id}`);
  
  // Rejoindre une room par équipe pour les notifications ciblées
  socket.on('joinTeam', (teamId) => {
    socket.join(`team_${teamId}`);
    console.log(`👤 Client ${socket.id} a rejoint la team ${teamId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté: ${socket.id}`);
  });
});

// ===========================================
// ============= MIDDLEWARES =================
// ===========================================
// Sécurité des headers HTTP
app.use(helmet());

// Logging des requêtes en mode dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limitation des requêtes (anti-spam / DDoS basique)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limite chaque IP à 1000 requêtes par 15min
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// ===========================================
// ============= API ROUTES ==================
// ===========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/notifications', notificationsRoutes);

// ===========================================
// ============= ERROR HANDLER ===============
// ===========================================
app.use((err, req, res, next) => {
  console.error('🔥 Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue', details: err.message });
});

// ===========================================
// ========== HEALTH CHECK ===================
// ===========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SportSync API (Production-Ready) is running!',
    version: '2.1.0 (WebSockets enabled)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Démarrer avec httpServer au lieu de app
httpServer.listen(PORT, () => {
  console.log(`\n  ⚽ SportSync API v2.1 (Production-Ready)`);
  console.log(`  🚀 Server running on port ${PORT}`);
  console.log(`  🌐 WebSockets: ENABLED`);
  console.log(`  🛡️ Security: Helmet, Rate-Limit, Morgan ENABLED`);
  console.log(`  🔗 Database: PostgreSQL (via Prisma)`);
  console.log(`  📊 Health check: http://localhost:${PORT}/api/health\n`);
});
