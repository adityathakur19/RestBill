const express = require("express");
const { getOrders, createOrder, updateOrder, deleteOrder } = require("../controllers/orderController");
const { protect } = require("../config/authMiddleware");

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

module.exports = router;
