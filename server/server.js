const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const Admin = require('./models/Admin');

const app = express();

const PORT = process.env.PORT || 5035;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

// MongoDB Connection
async function connectDB() {
    try {
        if (!MONGODB_URL) {
            throw new Error('MONGODB_URL is missing in .env');
        }

        console.log('Connecting to MongoDB...');
        console.log('MongoDB URL loaded');

        await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });

        console.log('Connected to MongoDB successfully');

        // Seed Admin
        const adminEmail = 'Clothing@gmail.com';

        const existingAdmin = await Admin.findOne({
            email: adminEmail
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(
                'Clothing@1234#',
                10
            );

            const newAdmin = new Admin({
                email: adminEmail,
                password: hashedPassword
            });

            await newAdmin.save();

            console.log(
                'Admin seeded successfully with email:',
                adminEmail
            );
        } else {
            console.log('Admin already exists');
        }

    } catch (error) {
        console.error('MongoDB connection error:');
        console.error(error);
    }
}

connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});