const express = require('express');
const Party = require('../models/table');

const router = express.Router();

// Create a new Party
router.post('/party', async (req, res) => {
  try {
    const party = new Party(req.body);
    const savedParty = await party.save();
    res.status(201).json(savedParty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Parties
router.get('/party', async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Party by ID
router.get('/party/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Party by ID
router.put('/party/:id', async (req, res) => {
  try {
    const updatedParty = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedParty) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json(updatedParty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Party by ID
router.delete('/party/:id', async (req, res) => {
  try {
    const deletedParty = await Party.findByIdAndDelete(req.params.id);
    if (!deletedParty) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
