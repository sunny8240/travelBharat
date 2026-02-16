require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const State = require('../models/State');
const User = require('../models/User');

const dbOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tlsInsecure: false,
  authSource: 'admin'
};

async function checkDestinations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, dbOptions);

    const destinations = await Destination.find({})
      .populate('state', 'name slug')
      .populate('createdBy', 'name email');

    if (destinations.length > 0) {
      destinations.forEach((dest, idx) => {
        console.log(`${idx + 1}. ${dest.name} (State: ${dest.state?.name}, Approved: ${dest.isApproved})`);
      });
    }

    const approved = await Destination.countDocuments({ isApproved: true });
    const pending = await Destination.countDocuments({ isApproved: false });
    const withImages = await Destination.countDocuments({ images: { $exists: true, $ne: [] } });
    const noImages = await Destination.countDocuments({ images: { $exists: false } });
    
    console.log(`\nTotal: ${destinations.length} | Approved: ${approved} | Pending: ${pending} | With Images: ${withImages} | Without Images: ${noImages}`);

    await mongoose.connection.close();
  } catch (error) {
    process.exit(1);
  }
}

checkDestinations();
