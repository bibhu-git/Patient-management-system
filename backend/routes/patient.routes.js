import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patient.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

export default router;