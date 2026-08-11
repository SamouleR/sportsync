import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMedicalReports = async (req, res) => {
  try {
    const { playerId, team, status } = req.query;
    let where = {};
    if (playerId) where.playerId = playerId;
    if (status && status !== 'tous') where.status = status;

    // If team filter, we need to join through player
    if (team) {
      where.player = { team };
    }

    const reports = await prisma.medicalReport.findMany({
      where,
      include: { player: { select: { name: true, avatar: true, avatarColor: true, team: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createMedicalReport = async (req, res) => {
  try {
    const { playerId, type, zone, severity, description, startDate, estimatedReturn, status } = req.body;
    const report = await prisma.medicalReport.create({
      data: { playerId, type, zone, severity, description, startDate, estimatedReturn, status: status || 'actif' }
    });

    // Notify the player
    await prisma.notification.create({
      data: {
        userId: playerId,
        type: 'medical',
        title: 'Signalement médical',
        message: `Un ${type} a été signalé (${zone} — ${severity})`,
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating medical report:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateMedicalReport = async (req, res) => {
  try {
    const { status, estimatedReturn } = req.body;
    const report = await prisma.medicalReport.update({
      where: { id: req.params.id },
      data: { status, estimatedReturn }
    });
    res.json(report);
  } catch (error) {
    console.error('Error updating medical report:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
