const State = require('../models/State');

// Get approved states
exports.getAllStates = async (req, res, next) => {
  try {
    const states = await State.find({ isApproved: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: states.length,
      data: states
    });
  } catch (error) {
    next(error);
  }
};

// Get all states (admin)
exports.getAllStatesAdmin = async (req, res, next) => {
  try {
    const states = await State.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: states.length,
      data: states
    });
  } catch (error) {
    next(error);
  }
};

// Get by slug
exports.getStateBySlug = async (req, res, next) => {
  try {
    const state = await State.findOne({ slug: req.params.slug });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    res.status(200).json({
      success: true,
      data: state
    });
  } catch (error) {
    next(error);
  }
};

// Create state
exports.createState = async (req, res, next) => {
  try {
    const state = await State.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'State created successfully',
      data: state
    });
  } catch (error) {
    next(error);
  }
};

// Update state
exports.updateState = async (req, res, next) => {
  try {
    let state = await State.findById(req.params.id);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    state = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'State updated successfully',
      data: state
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete state by ID
 */

// Delete
exports.deleteState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'State deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve state (set as approved)
 */

// Approve
exports.approveState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!state) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }

    res.status(200).json({ success: true, message: 'State approved', data: state });
  } catch (error) {
    next(error);
  }
};
