'use strict';
const express = require('express');
const router = express.Router();
const parser = require('../helpers/file-upload');
const User = require('../models/User');
const { urlGoogle } = require('../helpers/google-util');
const { requireLogged } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  const url = urlGoogle();

  res.render('index', { url });
});

router.get('/profile', requireLogged, (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('profile/profile', currentUser);
});

router.post('/profile-image', parser.single('image'), async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.session.currentUser._id, { $set: { imageUrl: req.file.url } });
    const newSession = await User.findById(req.session.currentUser._id);
    req.session.currentUser = newSession;
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
