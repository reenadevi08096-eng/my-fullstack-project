const router = require('express').Router();
const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');

// Get all items for current user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ authorId: req.user.id });
    res.json(items);
  } catch (err) {
    console.log("DETAILED ERROR (GET):", err);
    res.status(500).json({ error: err.message });
  }
});

// Create item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newItem = new Item({ 
      title, 
      description, 
      authorId: req.user.id 
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.log("DETAILED ERROR (POST):", err);
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    console.log("DETAILED ERROR (PUT):", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.log("DETAILED ERROR (DELETE):", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;