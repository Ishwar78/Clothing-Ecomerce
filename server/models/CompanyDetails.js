const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema({
    companyName: { type: String, default: 'Shree Balaji Vastraalaya' },
    tagline: { type: String, default: 'Joyfulmarts Fashion Store - Complete Family Wear' },
    gstin: { type: String, default: '06ABCDE1234F1Z5' },
    panNumber: { type: String, default: 'ABCDE1234F' },
    phone: { type: String, default: '+91 98765 43210' },
    alternatePhone: { type: String, default: '+91 98765 43211' },
    email: { type: String, default: 'billing@shreebalaji.com' },
    supportEmail: { type: String, default: 'support@shreebalaji.com' },
    address: { type: String, default: 'Shop No. 12-14, Shree Balaji Complex, Main Cloth Market' },
    city: { type: String, default: 'Rohtak' },
    state: { type: String, default: 'Haryana' },
    pincode: { type: String, default: '124001' },
    invoicePrefix: { type: String, default: 'INV-Joyfulmarts-' },
    terms: { 
        type: String, 
        default: '1. Goods once sold can be returned/exchanged within 7 days in unused condition with original tags.\n2. All disputes are subject to local jurisdiction.\n3. This is a computer-generated tax invoice.' 
    },
    authorizedSignatory: { type: String, default: 'For Shree Balaji Vastraalaya' }
}, { timestamps: true });

module.exports = mongoose.model('CompanyDetails', companyDetailsSchema);
