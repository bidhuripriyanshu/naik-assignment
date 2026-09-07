const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');
const products = require('./seedData');

const seedDB = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑  Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Naik Admin',
      email: 'admin@naikfoods.co.in',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('👤 Admin user created: admin@naikfoods.co.in / admin123');

    await Product.insertMany(products);
    console.log(`🌿 ${products.length} products seeded`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
