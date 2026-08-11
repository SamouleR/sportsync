import express from 'express';
import {
  getAllTrainings, createTraining, deleteTraining,
  getTrainingResponses, setTrainingResponse,
  getTrainingMessages, sendTrainingMessage
} from '../controllers/trainings.controller.js';

const router = express.Router();

router.get('/', getAllTrainings);
router.post('/', createTraining);
router.delete('/:id', deleteTraining);
router.get('/:id/responses', getTrainingResponses);
router.post('/:id/responses', setTrainingResponse);
router.get('/:id/messages', getTrainingMessages);
router.post('/:id/messages', sendTrainingMessage);

export default router;
