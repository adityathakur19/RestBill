const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  saleNo: { type: String, required: true },
  billDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  billingTerm: { type: String, required: true },
  total: { type: Number, required: true },
  gstin: { type: String, required: true },
  deliveryState: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);