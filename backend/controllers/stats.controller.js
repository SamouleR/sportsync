import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updatePlayerStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { form, rating, stamina } = req.body;
    
    const updatedStats = await prisma.userStats.update({
      where: { userId },
      data: { form, rating, stamina }
    });
    
    res.json(updatedStats);
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
