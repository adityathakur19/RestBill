const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customerName: { type: String, required: true },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["New", "Accepted", "Rejected"], default: "New" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
