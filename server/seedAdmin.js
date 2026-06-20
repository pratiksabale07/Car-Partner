/**
 * Creates (or resets) the admin account.
 * Run once: node seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Remove any existing admin accounts
  await User.deleteMany({ role: 'admin' });

  await User.create({
    name: 'Admin',
    username: 'admin',
    email: 'admin@carpartner.local',
    password: 'admin',
    role: 'admin',
  });

  console.log('Admin account created — username: admin / password: admin');
  process.exit(0);
};

run().catch(err => { console.error(err.message); process.exit(1); });
