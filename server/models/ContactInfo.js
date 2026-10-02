const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    phone: { type: String, default: '+91 98765 43210' },
    alternatePhone: { type: String, default: '+91 98765 43211' },
    email: { type: String, default: 'support@shreebalaji.com' },
    alternateEmail: { type: String, default: 'info@shreebalaji.com' },
    address: { type: String, default: 'Shree Balaji Vastraalaya, Main Market' },
    city: { type: String, default: 'Rohtak' },
    state: { type: String, default: 'Haryana' },
    pincode: { type: String, default: '124001' },
    workingHours: { type: String, default: 'Monday - Saturday, 10:00 AM - 8:00 PM' },
    mapUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
