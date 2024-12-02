const express = require('express');
const router = express.Router();
const Sale = require('../models/salesModel');

// Create a new sale
router.post('/', async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single sale
router.get('/:id', getSale, (req, res) => {
  res.json(res.sale);
});

// Update a sale
router.patch('/:id', getSale, async (req, res) => {
  if (req.body.saleNo != null) {
    res.sale.saleNo = req.body.saleNo;
  }
  if (req.body.billDate != null) {
    res.sale.billDate = req.body.billDate;
  }
  // Update other fields
  try {
    const updatedSale = await res.sale.save();
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a sale
router.delete('/:id', getSale, async (req, res) => {
  try {
    await res.sale.remove();
    res.json({ message: 'Deleted sale' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getSale(req, res, next) {
  let sale;
  try {
    sale = await Sale.findById(req.params.id);
    if (sale == null) {
      return res.status(404).json({ message: 'Cannot find sale' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.sale = sale;
  next();
}

module.exports = router;