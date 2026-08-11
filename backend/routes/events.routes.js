import express from 'express';
import { getAllEvents, getEventById, updateMatchLiveState, closeMatch } from '../controllers/events.controller.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id/live', updateMatchLiveState);
router.post('/:id/close', closeMatch);

export default router;
