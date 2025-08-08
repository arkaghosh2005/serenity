// /api/journal.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([{
        id: 1,
        text: "Sample entry",
        timestamp: Date.now(),
        mood: "neutral",
        sentiment: 0.5
    }]);
});
console.log('route journal reached')
router.post('/', (req, res) => {
    console.log("Post reached")
    const { text } = req.body
    if (!text) 
    return res.status(400).json({ error: 'Text is required' })

    console.log('New journal entry:', text)

    // Simulate DB save
    const newEntry = {
        id: Date.now(),
        text,
        timestamp: Date.now(),
        mood: "neutral",
        sentiment: 0.5
    }
    res.json(newEntry)
})


module.exports = router;
