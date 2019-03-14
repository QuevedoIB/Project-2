'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Events');

/* SIGNUP */

router.get('/events/:id/comments', async (req, res, next) => {
  const { id } = req.params;
  try {
    const eventComments = await Event.findById(id, { comments: true });
    res.json(eventComments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
