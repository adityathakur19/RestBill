const express = require('express');
const router = express.Router();
const Party = require('../models/Party');

// Create new party
router.post('/', async (req, res) => {
  try {
    const party = await Party.create(req.body);
    res.status(201).json({
      success: true,
      data: party
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json({
      success: true,
      count: parties.length,
      data: parties
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get single party
router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({
        success: false,
        error: 'Party not found'
      });
    }
    res.status(200).json({
      success: true,
      data: party
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update party
router.put('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!party) {
      return res.status(404).json({
        success: false,
        error: 'Party not found'
      });
    }
    res.status(200).json({
      success: true,
      data: party
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete party
router.delete('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) {
      return res.status(404).json({
        success: false,
        error: 'Party not found'
      });
    }
    res.status(200).json({
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