const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const uploadRoute = require('./routes/uploadRoute');
const bannerRoute = require('./routes/bannerRoute');
const Admin = require('./models/Admin');
const Category = require('./models/Category');

const app = express();

const PORT = process.env.PORT || 5035;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support base64 images

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/banners', bannerRoute);
app.use('/api/upload', uploadRoute);

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

        // Seed Categories if empty
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            console.log('Seeding initial categories...');
            const initialCategories = [
                { name: 'Men', path: '/men', image: '/assets/mencategory1.png', subcategories: [] },
                { name: 'Women', path: '/women', image: '/assets/women.png', subcategories: [] },
                { name: 'Boys', path: '/boys', image: '/assets/boys.png', subcategories: [] },
                { name: 'Girls', path: '/girls', image: '/assets/girls.png', subcategories: [] },
                { name: 'Ethnic Wear', path: '/ethnic-wear', image: '/assets/ethnic.png', subcategories: [] },
                { name: 'Footwear', path: '/footwear', image: '/assets/footwears.png', subcategories: [] },
                { name: 'Accessories', path: '/accessories', image: '/assets/accso.png', subcategories: [] },
                { name: 'Sale', path: '/sale', image: '/assets/sale.png', subcategories: [] }
            ];
            await Category.insertMany(initialCategories);
            console.log('Categories seeded successfully');
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
