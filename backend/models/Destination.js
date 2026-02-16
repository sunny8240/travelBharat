const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  },
  city: String,
  category: {
    type: String,
    enum: ['Heritage', 'Nature', 'Religious', 'Adventure', 'Beach', 'Hill Station'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  historicalSignificance: String,
  bestTimeToVisit: String,
  entryFee: String,
  timings: String,
  images: [String],
  nearbyAttractions: [String],
  mapLink: String,
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate slug
destinationSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

// Geospatial index
destinationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
