import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctor.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllDoctors)
  .post(createDoctor);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

export default router;