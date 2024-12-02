// models/Estimate.js
const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  estimateNo: {
    type: String,
    required: true,
    unique: true
  },
  party: {
    name: String,
    phone: String,
    businessName: String,
    category: String,
    _id: mongoose.Schema.Types.ObjectId
  },
  items: [{
    itemName: String,
    sellPrice: Number,
    quantity: Number,
    id: String
  }],
  billingTerm: String,
  billDate: Date,
  dueDate: Date,
  deliveryState: String,
  cashDiscountPercentage: Number,
  cashDiscountAmount: Number,
  serviceChargePercentage: Number,
  serviceChargeAmount: Number,
  totalAmount: Number,
  estimateNote: String,
  transport: {
    labourCharges: Number,
    purchaseOrderNumber: String,
    challanNumber: String,
    eWayBillNumber: String,
    eWayBillDate: Date,
    transporterName: String,
    vehicleNumber: String,
    transportDistance: Number,
    deliveryLocation: String,
    deliveryDate: Date,
    termsConditions: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Estimate', estimateSchema);