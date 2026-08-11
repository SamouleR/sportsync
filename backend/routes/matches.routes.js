import express from 'express';
import {
  getAllMatches, getMatchById, createMatch, updateMatch,
  updateConvocations, updateLineup
} from '../controllers/matches.controller.js';

const router = express.Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', createMatch);
router.put('/:id', updateMatch);
router.put('/:id/convocations', updateConvocations);
router.put('/:id/lineup', updateLineup);

export default router;
