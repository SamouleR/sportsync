import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true }
    });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.params.userId, read: false },
      data: { read: true }
    });
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, link } = req.body;
    const notification = await prisma.notification.create({
      data: { userId, type, title, message, link }
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
