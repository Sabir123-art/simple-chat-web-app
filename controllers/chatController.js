const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('chat', { user: req.user });
});

module.exports = router;
