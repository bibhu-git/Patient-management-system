import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;