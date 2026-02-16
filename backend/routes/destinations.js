const express = require('express');
const router = express.Router();
const { 
  getAllDestinations,
  getDestinationBySlug,
  getDestinationById,
  getDestinationsByState,
  getNearbyDestinations,
  createDestination,
  updateDestination,
  getAllDestinationsAdmin,
  approveDestination,
  deleteDestination
} = require('../controllers/destinationController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/', getAllDestinations);

// Admin (before generic :id route)
router.get('/all', protect, authorize('admin'), getAllDestinationsAdmin);
router.post('/', protect, authorize('admin'), createDestination);
router.put('/:id', protect, authorize('admin'), updateDestination);
router.patch('/:id/approve', protect, authorize('admin'), approveDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

// Public (specific routes before generic :id)
router.get('/nearby', getNearbyDestinations);
router.get('/state/:stateId', getDestinationsByState);
router.get('/slug/:slug', getDestinationBySlug);
router.get('/:id', getDestinationById);

module.exports = router;
