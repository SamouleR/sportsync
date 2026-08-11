import { PrismaClient } from '@prisma/client';
import { io } from '../server.js';
const prisma = new PrismaClient();

export const getAllMatches = async (req, res) => {
  try {
    const { team } = req.query;
    const where = team ? { team } : {};
    const matches = await prisma.match.findMany({ where, orderBy: { date: 'asc' } });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const match = await prisma.match.findUnique({ where: { id: req.params.id } });
    if (!match) return res.status(404).json({ message: 'Match non trouvé' });
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createMatch = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, opponent, type, team } = req.body;
    const match = await prisma.match.create({
      data: { title, date, startTime, endTime, location, opponent, type, team }
    });

    // Notify all players
    const players = await prisma.user.findMany({ where: { role: 'player', team } });
    for (const player of players) {
      await prisma.notification.create({
        data: {
          userId: player.id,
          type: 'match',
          title: 'Nouveau match programmé',
          message: `${title} vs ${opponent} — ${date} à ${startTime}`,
          link: match.id
        }
      });
    }

    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await prisma.match.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateConvocations = async (req, res) => {
  try {
    const { convocations, convStatus } = req.body;
    const match = await prisma.match.update({
      where: { id: req.params.id },
      data: {
        convocations: JSON.stringify(convocations),
        convStatus: JSON.stringify(convStatus)
      }
    });

    // Notify convoked players
    for (const playerId of convocations) {
      await prisma.notification.create({
        data: {
          userId: playerId,
          type: 'match',
          title: '🏆 Convocation !',
          message: 'Vous avez été convoqué pour le prochain match.',
          link: req.params.id
        }
      });
    }

    io.to(`team_${match.team}`).emit('matchConvocationsUpdated', match);

    res.json(match);
  } catch (error) {
    console.error('Error updating convocations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateLineup = async (req, res) => {
  try {
    const { lineup } = req.body;
    const match = await prisma.match.update({
      where: { id: req.params.id },
      data: { lineup: JSON.stringify(lineup) }
    });
    io.to(`team_${match.team}`).emit('matchLineupUpdated', match);
    res.json(match);
  } catch (error) {
    console.error('Error updating lineup:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
