/**
 * Run this once to create your personal admin account:
 *   node createAdmin.js
 *
 * Edit the credentials below before running.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAIL    = 'pratiksabale.ps@gmail.com'; // ← your email
const ADMIN_PASSWORD = 'YourStrongPassword123';      // ← change this
const ADMIN_NAME     = 'Pratik Sabale';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === 'admin') {
      console.log('Admin already exists:', ADMIN_EMAIL);
    } else {
      existing.role = 'admin';
      existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log('Updated existing user to admin:', ADMIN_EMAIL);
    }
    return process.exit(0);
  }

  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
  console.log('Admin created:', ADMIN_EMAIL);
  process.exit(0);
};

run().catch(err => { console.error(err.message); process.exit(1); });
