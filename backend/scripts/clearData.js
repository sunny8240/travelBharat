require('dotenv').config();
const mongoose = require('mongoose');
const State = require('../models/State');
const Destination = require('../models/Destination');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });

    try {
      await State.collection.drop();
    } catch (err) {
    }

    try {
      await Destination.collection.drop();
    } catch (err) {
    }
    
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

clearDatabase();
