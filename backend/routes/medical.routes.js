import express from 'express';
import {
  getMedicalReports, createMedicalReport, updateMedicalReport
} from '../controllers/medical.controller.js';

const router = express.Router();

router.get('/', getMedicalReports);
router.post('/', createMedicalReport);
router.put('/:id', updateMedicalReport);

export default router;
