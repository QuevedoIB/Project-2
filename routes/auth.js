'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { getGoogleAccountFromCode } = require('../helpers/google-util');

const saltRounds = 10;
const { requireAnon, requireLogged, requireFieldsSignUp, requireFieldsLogIn } = require('../middlewares/auth');

/* SIGNUP */

router.get('/signup', (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireFieldsSignUp, async (req, res, next) => {
  const { username, name, password } = req.body;
  try {
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation', 'The username is taken');
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
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFieldsLogIn, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'User or password incorrect');
      res.redirect('/auth/login');
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // guardar la sesion
      req.session.currentUser = user;
      res.redirect('/profile');
    } else {
      req.flash('validation', 'User or password incorrect');
      // redirigir
      res.redirect('/auth/login');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireLogged, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

router.get('/change-password', requireLogged, (req, res, next) => {
  console.log(req.session.currentUser);
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/change-password', data);
});

router.post('/change-password', requireLogged, async (req, res, next) => {
  const { newName, currentPass, newPass } = req.body;
  const userSession = req.session.currentUser;
  try {
    if (userSession.googleUser) {
      await User.findByIdAndUpdate(userSession._id, { $set: { name: newName } });
      return res.redirect('/profile');
    }
    const user = await User.findById(userSession._id);
    if (bcrypt.compareSync(currentPass, user.password)) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(newPass, salt);
      const user = await User.findByIdAndUpdate(userSession._id, { $set: { password: hashedPassword } }, { new: true });
      // guardar la sesion
      req.session.currentUser = user;
      res.redirect('/profile');
    } else {
      req.flash('validation', 'Password incorrect');
      // redirigir
      res.redirect('/auth/change-password');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/google-credentials', async (req, res, next) => {
  const { code } = req.query;
  const userData = await getGoogleAccountFromCode(code);
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(userData.id, salt);
    const newUser = {
      username: userData.email,
      name: userData.email,
      password: hashedPassword,
      email: userData.email,
      googleUser: true
    };
    const user = await User.find({ $and: [{ username: userData.email }, { password: hashedPassword }] });
    if (user.length) {
      req.session.currentUser = user;
    } else {
      const createdUser = await User.create(newUser);
      req.session.currentUser = createdUser;
    }
    return res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
