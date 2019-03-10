'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

const saltRounds = 10;
const { requireAnon, requireLogged, requireFieldsSignUp, requireFieldsLogIn } = require('../middlewares/auth');

/* SIGNUP */
router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/signup',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/profile');
  });

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', requireFieldsSignUp, async (req, res, next) => {
  const { username, name, password } = req.body;
  try {
    const result = await User.findOne({ username });
    if (result) {
      // the username is taken
      res.redirect('/auth/signup');
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        username,
        name,
        password: hashedPassword

      };
      const createdUser = await User.create(newUser);
      req.session.currentUser = createdUser;
      res.redirect('/profile');
    }
  } catch (err) {
    next(err);
  }
});

/* LOGIN */
router.get('/login', requireAnon, (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', requireAnon, requireFieldsLogIn, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      // flash username or password incorrect
      res.redirect('/auth/login');
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // guardar la sesion
      req.session.currentUser = user;
      res.redirect('/profile');
    } else {
      // flash username or password incorrect
      // redirigir
      res.redirect('/auth/login');
    }
  } catch (err) {
    next(err);
  }
});

// router.post('/logout', requireLogged, (req, res, next) => {
//   delete req.session.currentUser;
//   res.redirect('/');
// });

router.post('/logout', requireLogged, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
