import express from 'express';
import {
  getNotifications, markNotificationRead, markAllRead, createNotification
} from '../controllers/notifications.controller.js';

const router = express.Router();

router.get('/:userId', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/user/:userId/read-all', markAllRead);
router.post('/', createNotification);

export default router;
