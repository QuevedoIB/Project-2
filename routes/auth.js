const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* SIGNUP */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup',);
});

router.post('/signup', async (req, res, next) => {
  const { username, name, password } = req.body;
  const user = { username, name, password };
  if (!name || !username || !password) {
    // flash (make sure you have all the fields)
    res.redirect('/auth/signup');     
  } else {
    try {
      const newUser = await User.create(user);
      res.redirect('/auth/profile');
    } catch(err) {
      next(err);
    }    
  }
  
});

/* LOGIN */
router.get('/login', (req, res, next) => {
  res.render('auth/login',);
});

module.exports = router;
