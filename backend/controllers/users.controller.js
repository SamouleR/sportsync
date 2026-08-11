import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const { team, role } = req.query;
    const where = {};
    if (team) where.team = team;
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      include: { stats: true }
    });
    const safeUsers = users.map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { stats: true }
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, team, position, category, level } = req.body;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const hue = Math.floor(Math.random() * 360);

    const user = await prisma.user.create({
      data: {
        name, email,
        password: password || 'default123',
        role: role || 'player',
        team: team || 'Équipe Senior',
        avatar: initials,
        avatarColor: `hsl(${hue},70%,50%)`,
        position, category, level,
        medicalStatus: 'Manquant',
        stats: {
          create: { rating: 70, stamina: 80, form: 7.0 }
        }
      },
      include: { stats: true }
    });
    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Cet email existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { stats, ...userData } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: userData,
      include: { stats: true }
    });

    // Update stats if provided
    if (stats) {
      await prisma.userStats.upsert({
        where: { userId: req.params.id },
        update: stats,
        create: { userId: req.params.id, ...stats }
      });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
