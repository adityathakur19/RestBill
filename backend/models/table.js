const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Customer', 'Supplier'], required: true },
  phone: { type: String, required: false },
  category: { type: String, required: false },
  gstin: { type: String, required: false },
  billType: { type: String, required: false },
  billingTerm: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  businessName: { type: String, required: false },
  email: { type: String, required: false },
  billingAddress: { type: String, required: false },
  billingState: { type: String, required: false },
  billingPincode: { type: String, required: false },
  deliveryAddress: { type: String, required: false },
  deliveryState: { type: String, required: false },
  deliveryPincode: { type: String, required: false },
  whatsappAlerts: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
