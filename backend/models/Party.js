const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer/Supplier name is required']
  },
  type: {
    type: String,
    enum: ['Customer', 'Supplier'],
    default: 'Customer'
  },
  phone: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['VEG', 'NON-VEG', ''],
    default: ''
  },
  gstin: {
    type: String,
    trim: true
  },
  billType: {
    type: String,
    enum: ['Online', 'AC', 'NonAC', 'Regular', ''],
    default: ''
  },
  billingTerm: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  businessName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  billingAddress: {
    type: String,
    trim: true
  },
  billingState: {
    type: String,
    trim: true
  },
  billingPincode: {
    type: String,
    trim: true
  },
  deliveryAddress: {
    type: String,
    trim: true
  },
  deliveryState: {
    type: String,
    trim: true
  },
  deliveryPincode: {
    type: String,
    trim: true
  },
  whatsappAlerts: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'Yes'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Party', partySchema);