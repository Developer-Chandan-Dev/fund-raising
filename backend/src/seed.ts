import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Campaign from './models/Campaign';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  // Clear existing data
  await User.deleteMany({});
  await Campaign.deleteMany({});

  // Create users
  const admin = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  const intern = new User({
    name: 'Intern User',
    email: 'intern@example.com',
    password: 'password123',
  });

  await admin.save();
  await intern.save();

  // Create campaigns
  const campaign1 = new Campaign({
    title: 'Help Interns Learn',
    description: 'Support interns in gaining valuable skills',
    goalAmount: 10000,
    createdBy: admin._id,
    imageUrl: 'https://example.com/image1.jpg'
  });

  const campaign2 = new Campaign({
    title: 'Summer Internship Program',
    description: 'Fund a summer program for 20 interns',
    goalAmount: 50000,
    createdBy: admin._id,
    imageUrl: 'https://example.com/image2.jpg'
  });

  await campaign1.save();
  await campaign2.save();

  console.log('Database seeded!');
  process.exit();
};

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});