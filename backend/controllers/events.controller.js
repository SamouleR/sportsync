import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllEvents = async (req, res) => {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        responses: true,
        creator: {
          select: { name: true }
        }
      }
    });
    const matches = await prisma.match.findMany();
    
    res.json({
      trainings,
      matches
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getEventById = async (req, res) => {
  // Can be implemented to fetch specific training or match
  res.json({ message: 'Not implemented yet' });
};

export const updateMatchLiveState = async (req, res) => {
  try {
    const { id } = req.params;
    const { liveState } = req.body;
    
    const updatedMatch = await prisma.match.update({
      where: { id },
      data: { liveState: JSON.stringify(liveState) }
    });
    
    res.json(updatedMatch);
  } catch (error) {
    console.error('Error updating live state:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const closeMatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Custom logic to close a match... For now just clear liveState or set a flag
    const closedMatch = await prisma.match.update({
      where: { id },
      data: { liveState: JSON.stringify({ isClosed: true }) }
    });
    
    res.json(closedMatch);
  } catch (error) {
    console.error('Error closing match:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
