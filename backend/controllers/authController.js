const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Admin login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        let adminUser = await User.findOne({ email, role: 'admin' });
        
        if (!adminUser) {
          adminUser = await User.create({
            name: 'Admin',
            email: email,
            password: password,
            role: 'admin'
          });
        }

        const token = generateToken(adminUser);

        return res.status(200).json({
          success: true,
          token: token,
          user: {
            id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role
          }
        });
      }
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Password match
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!['admin', 'moderator'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for admin access'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user details
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new admin user (first time setup)
 */
exports.createAdminUser = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin only already exists'
      });
    }

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Admin only created successfully',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
