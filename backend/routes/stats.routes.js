import express from 'express';
import { updatePlayerStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.put('/:userId', updatePlayerStats);

export default router;
