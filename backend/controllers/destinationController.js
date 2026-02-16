const Destination = require('../models/Destination');
const mongoose = require('mongoose');

// Get approved destinations
exports.getAllDestinations = async (req, res, next) => {
  try {
    const { state, category, search, page = 1, limit = 12 } = req.query;
    let filter = { isApproved: true };
    
    if (state) {
      filter.state = state;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const destinations = await Destination.find(filter)
      .populate('state', 'name slug')
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Destination.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: destinations.length,
      total: total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// Get all destinations (admin)
exports.getAllDestinationsAdmin = async (req, res, next) => {
  try {
    const { state, category, search, page = 1, limit = 100 } = req.query;
    let filter = {};

    if (state) {
      filter.state = state;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const destinations = await Destination.find(filter)
      .populate('state', 'name slug')
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Destination.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: destinations.length,
      total: total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// Get by slug
exports.getDestinationBySlug = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug })
      .populate('state', 'name slug')
      .populate('createdBy', 'name email');
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
}

// Get single destination by ID
exports.getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('state', 'name slug')
      .populate('createdBy', 'name email');
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
}

// Get destinations by state
exports.getDestinationsByState = async (req, res, next) => {
  try {
    const stateId = req.params.stateId;

    if (!stateId) {
      return res.status(400).json({ success: false, message: 'State ID is required' });
    }

    const destinations = await Destination.find({
      state: stateId,
      isApproved: true
    })
      .populate('state', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    next(error);
  }
}

// Get nearby destinations within a radius
exports.getNearbyDestinations = async (req, res, next) => {
  try {
    const { lat, lng, radiusKm = 50, limit = 6 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radiusKm);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; 
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const allDestinations = await Destination.find({
      isApproved: true,
      latitude: { $exists: true, $ne: null },
      longitude: { $exists: true, $ne: null }
    })
      .populate('state', 'name slug')
      .select('name city category state latitude longitude images description slug');

    const nearbyDestinations = allDestinations
      .map(dest => ({
        ...dest.toObject(),
        distance: calculateDistance(latitude, longitude, dest.latitude, dest.longitude)
      }))
      .filter(dest => dest.distance <= radiusInKm && dest.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: nearbyDestinations.length,
      data: nearbyDestinations
    });
  } catch (error) {
 
  }
};

// Create destination (admin)
exports.createDestination = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.state || !req.body.category || !req.body.description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, state, category, description'
      });
    }

    if (req.user && mongoose.Types.ObjectId.isValid(req.user.id)) {
      req.body.createdBy = req.user.id;
    }
    
    const destination = await Destination.create(req.body);
    await destination.populate('state', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing destination
 */
exports.updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('state', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve destination (set as approved)
 */
exports.approveDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination approved',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// Delete destination (admin)
exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
