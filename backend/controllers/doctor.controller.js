import Doctor from '../models/doctor.model.js';


const validateDoctor = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!data.specialization || data.specialization.trim() === '') {
    errors.push('Specialization is required');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone is required');
  }

  if (data.experience != null && data.experience < 0) {
    errors.push('Experience cannot be negative');
  }

  if (data.consultationFee != null && data.consultationFee < 0) {
    errors.push('Consultation fee cannot be negative');
  }

  if (data.availableDays) {
    const validDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const invalidDays = data.availableDays.filter(
      (day) => !validDays.includes(day)
    );

    if (invalidDays.length > 0) {
      errors.push('Invalid available days provided');
    }
  }

  return errors;
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;

    const query = { isActive: true };

    // Search by name or specialization
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by specialization
    if (specialization) {
      query.specialization = {
        $regex: specialization,
        $options: 'i',
      };
    }

    const doctors = await Doctor.find(query).sort({ name: 1 });

    res.json(doctors);
  } catch (err) {
    next(err);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found.',
      });
    }

    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const errors = validateDoctor(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const doctor = await Doctor.create(req.body);

    res.status(201).json(doctor);
  } catch (err) {
    next(err);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const errors = validateDoctor(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found.',
      });
    }

    res.json(doctor);
  } catch (err) {
    next(err);
  }
};


export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found.',
      });
    }

    res.json({
      message: 'Doctor removed successfully.',
    });
  } catch (err) {
    next(err);
  }
};