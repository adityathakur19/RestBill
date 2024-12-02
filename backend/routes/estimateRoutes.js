// routes/estimateRoutes.js
const express = require('express');
const router = express.Router();
const Estimate = require('../models/Estimate');

// Create new estimate
router.post('/', async (req, res) => {
  try {
    const estimate = new Estimate(req.body);
    const savedEstimate = await estimate.save();
    res.status(201).json({
      success: true,
      data: savedEstimate
    });
  } catch (error) {
    console.error('Error creating estimate:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all estimates
router.get('/', async (req, res) => {
  try {
    const estimates = await Estimate.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: estimates
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get single estimate
router.get('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }
    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update estimate
router.put('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }
    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete estimate
router.delete('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndDelete(req.params.id);
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;