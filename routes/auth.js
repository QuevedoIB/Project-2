const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* SIGNUP */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, name, password } = req.body;
  const user = { username, name, password };
  if (!name || !username || !password) {
    // flash (make sure you have all the fields)
    res.redirect('/auth/signup');
    return;
  }
  try {
    const result = await User.findOne({ username })
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
      res.redirect('/profile');
    }
  } catch (err) {
    next(err);
  }
});

/* LOGIN */
router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    // flash (make sure you have all the fields)
    res.redirect('/auth/signup');
  } else {
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
        console.log(req.session.currentUser);
        res.redirect('/');
      } else {
        // flash username or password incorrect
        // redirigir
        res.redirect('/auth/login');
      }

    } catch (err) {
      next(err);
    }
  }

  router.post('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    delete req.session.currentUser;
  })

});


module.exports = router;
