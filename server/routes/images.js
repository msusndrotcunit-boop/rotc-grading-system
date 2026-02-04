const express = require('express');
const db = require('../database');
const router = express.Router();

// Helper to serve Base64 image
const serveBase64Image = (res, base64String) => {
    if (!base64String || !base64String.startsWith('data:image')) {
        return res.status(404).send('Image not found');
    }

    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return res.status(500).send('Invalid image data');
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=86400' // Cache for 1 day
    });
    res.end(buffer);
};

// Get Activity Image
router.get('/activities/:id', (req, res) => {
    db.get('SELECT image_path FROM activities WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row || !row.image_path) return res.status(404).send('Image not found');
        serveBase64Image(res, row.image_path);
    });
});

// Get Cadet Profile Picture
router.get('/cadets/:id', (req, res) => {
    // Check 'cadets' table first
    db.get('SELECT profile_pic FROM cadets WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (row && row.profile_pic) {
            return serveBase64Image(res, row.profile_pic);
        }

        // Fallback to 'users' table if stored there (some versions might)
        // Or return 404/Default
        res.status(404).send('Image not found');
    });
});

// Get Staff Profile Picture
router.get('/staff/:id', (req, res) => {
    db.get('SELECT profile_pic FROM training_staff WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row || !row.profile_pic) return res.status(404).send('Image not found');
        serveBase64Image(res, row.profile_pic);
    });
});

module.exports = router;
