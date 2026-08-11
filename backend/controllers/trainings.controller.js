import { PrismaClient } from '@prisma/client';
import { io } from '../server.js';
const prisma = new PrismaClient();

export const getAllTrainings = async (req, res) => {
  try {
    const { team } = req.query;
    const where = team ? { team } : {};
    const trainings = await prisma.training.findMany({
      where,
      include: { responses: true, messages: { include: { user: { select: { name: true, avatar: true, avatarColor: true } } } }, creator: { select: { name: true } } },
      orderBy: { date: 'asc' }
    });
    res.json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createTraining = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, message, team, createdBy } = req.body;
    const training = await prisma.training.create({
      data: { title, date, startTime, endTime, location, message, team, createdBy }
    });

    // Auto-notify all players of the team
    const players = await prisma.user.findMany({ where: { role: 'player', team } });
    for (const player of players) {
      await prisma.notification.create({
        data: {
          userId: player.id,
          type: 'training',
          title: 'Nouvel entraînement',
          message: `${title} — le ${date} de ${startTime} à ${endTime} (${location})`,
          link: training.id
        }
      });
    }

    res.status(201).json(training);
  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteTraining = async (req, res) => {
  try {
    await prisma.training.delete({ where: { id: req.params.id } });
    res.json({ message: 'Entraînement supprimé' });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getTrainingResponses = async (req, res) => {
  try {
    const responses = await prisma.trainingResponse.findMany({
      where: { trainingId: req.params.id },
      include: { player: { select: { name: true, avatar: true, avatarColor: true } } }
    });
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const setTrainingResponse = async (req, res) => {
  try {
    const { playerId, status, remark, arrivalTime } = req.body;
    const response = await prisma.trainingResponse.upsert({
      where: { trainingId_playerId: { trainingId: req.params.id, playerId } },
      update: { status, remark, arrivalTime },
      create: { trainingId: req.params.id, playerId, status, remark, arrivalTime }
    });

    const training = await prisma.training.findUnique({ where: { id: req.params.id } });
    if (training) {
      io.to(`team_${training.team}`).emit('trainingResponseUpdated', response);
    }

    res.json(response);
  } catch (error) {
    console.error('Error setting response:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getTrainingMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { trainingId: req.params.id },
      include: { user: { select: { name: true, avatar: true, avatarColor: true } } },
      orderBy: { timestamp: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const sendTrainingMessage = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const message = await prisma.message.create({
      data: { trainingId: req.params.id, userId, text },
      include: { user: { select: { name: true, avatar: true, avatarColor: true } } }
    });

    const training = await prisma.training.findUnique({ where: { id: req.params.id } });
    if (training) {
      io.to(`team_${training.team}`).emit('trainingMessage', message);
    }

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
