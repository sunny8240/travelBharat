const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['State', 'UT'],
    required: true
  },
  capital: String,
  population: String,
  area_km2: Number,
  bestTimeToVisit: String,
  description: String,
  attractions: [String],
  images: [String],
  mapLink: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
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
stateSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('State', stateSchema);
