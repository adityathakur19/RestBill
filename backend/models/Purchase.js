const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseNo: {
    type: String,
    required: [true, 'Purchase number is required'],
    unique: true
  },
  party: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Party ID is required'],
      ref: 'Party'
    },
    name: String,
    phone: String,
    businessName: String,
    category: String
  },
  items: [{
    itemName: {
      type: String,
      required: [true, 'Item name is required']
    },
    sellPrice: {
      type: Number,
      required: [true, 'Sell price is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    id: String
  }],
  billingTerm: String,
  billDate: {
    type: Date,
    required: [true, 'Bill date is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  deliveryState: String,
  cashDiscountPercentage: {
    type: Number,
    default: 0
  },
  cashDiscountAmount: {
    type: Number,
    default: 0
  },
  serviceChargePercentage: {
    type: Number,
    default: 0
  },
  serviceChargeAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  purchaseNote: String,
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

// Add indexes for common queries
purchaseSchema.index({ purchaseNo: 1 });
purchaseSchema.index({ 'party._id': 1 });
purchaseSchema.index({ billDate: -1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;