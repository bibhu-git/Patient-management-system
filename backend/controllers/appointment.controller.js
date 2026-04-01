import Appointment from '../models/Appointment.model.js';

const validateAppointment = (data) => {
  const errors = [];

  if (!data.patient) {
    errors.push('Patient is required');
  }

  if (!data.doctor) {
    errors.push('Doctor is required');
  }

  if (!data.date) {
    errors.push('Date is required');
  }

  if (!data.time || data.time.trim() === '') {
    errors.push('Time is required');
  }

  if (
    data.status &&
    !['Scheduled', 'Completed', 'Cancelled'].includes(data.status)
  ) {
    errors.push('Invalid status value');
  }

  return errors;
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.date = { $gte: start, $lt: end };
    }

    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      appointments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.',
      });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const errors = validateAppointment(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const appointment = await Appointment.create(req.body);

    await appointment.populate('patient', 'name phone');
    await appointment.populate('doctor', 'name specialization');

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const errors = validateAppointment(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.',
      });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};


export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.',
      });
    }

    res.json({
      message: 'Appointment deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};