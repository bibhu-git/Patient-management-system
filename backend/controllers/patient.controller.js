import Patient from '../models/patient.model.js';


const validatePatient = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }

  if (data.age == null || data.age < 0 || data.age > 150) {
    errors.push('Valid age is required');
  }

  if (!['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push('Gender must be Male, Female, or Other');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone is required');
  }

  return errors;
};


export const getAllPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Patient.countDocuments(query);

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      patients,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json(patient);
  } catch (err) {
    next(err);
  }
};


export const createPatient = async (req, res, next) => {
  try {
    const errors = validatePatient(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const patient = await Patient.create(req.body);

    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};


export const updatePatient = async (req, res, next) => {
  try {
    const errors = validatePatient(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json(patient);
  } catch (err) {
    next(err);
  }
};


export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json({ message: 'Patient deleted successfully.' });
  } catch (err) {
    next(err);
  }
};