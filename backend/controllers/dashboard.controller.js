import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      recentAppointments,
    ] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isActive: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow },
      }),
      Appointment.find()
        .populate('patient', 'name')
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const appointmentsByStatus = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
      },
      appointmentsByStatus,
      recentAppointments,
    });
  } catch (err) {
    next(err);
  }
};