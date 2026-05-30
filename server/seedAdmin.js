/**
 * Seeds the company admin account (owner@cp.com).
 * Run once: node seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const admin = {
    name: 'CarPartner Admin',
    email: 'owner@cp.com',
    password: 'owner123',
    role: 'admin',
    phone: '9888888888',
    address: 'Pune, Maharashtra',
  };

  const existing = await User.findOne({ email: admin.email });
  if (!existing) {
    await User.create(admin);
    console.log('Admin account created: owner@cp.com / owner123');
  } else if (existing.role !== 'admin') {
    existing.role = 'admin';
    await existing.save();
    console.log('Existing account upgraded to admin: owner@cp.com');
  } else {
    console.log('Admin account already exists: owner@cp.com');
  }

  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
