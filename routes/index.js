'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/profile', (req, res, next) => {
  res.render('profile/profile');
});

module.exports = router;
