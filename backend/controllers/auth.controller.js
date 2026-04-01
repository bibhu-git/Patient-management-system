import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const validateAuth = (email, password) => {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const errors = validateAuth(email, password);

    if (!name || name.trim() === '') {
      errors.push('Name is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: 'Email already registered.',
      });
    }

    const admin = await Admin.create({ name, email, password });

    const token = signToken(admin._id);

    res.status(201).json({
      token,
      admin,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validateAuth(email, password);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(admin._id);

    res.json({
      token,
      admin,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({
    admin: req.admin,
  });
};