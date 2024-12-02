const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// Create new purchase
router.post('/purchases', async (req, res) => {
  try {
    // Validate required fields
    const { purchaseNo, party, items, billDate, dueDate, totalAmount } = req.body;
    
    if (!purchaseNo || !party || !items || !billDate || !dueDate || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create new purchase document
    const purchase = new Purchase(req.body);

    // Save the purchase
    await purchase.save();

    res.status(201).json({
      success: true,
      data: purchase
    });

  } catch (error) {
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Purchase number already exists'
      });
    }

    // Handle other errors
    console.error('Error creating purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating purchase'
    });
  }
});

// Get all purchases
router.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .limit(100);  // Limit to prevent overwhelming response

    res.json({
      success: true,
      count: purchases.length,
      data: purchases
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching purchases'
    });
  }
});

// Get single purchase by ID
router.get('/purchases/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    console.error('Error fetching purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching purchase'
    });
  }
});

// Update purchase
router.put('/purchases/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    console.error('Error updating purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating purchase'
    });
  }
});

// Delete purchase
router.delete('/purchases/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting purchase'
    });
  }
});

module.exports = router;