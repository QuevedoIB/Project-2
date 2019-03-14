'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Events');
const mongoose = require('mongoose');

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

router.post('/event/:id/comment/create', async (req, res, next) => {
  const { id } = req.params;

  const { comment } = req.body;

  const mongoId = mongoose.Types.ObjectId(id);

  console.log(req.body, 'ADIOOOOOOOOOOOOS');

  console.log(comment, 'HOOOOOOOOOOOOLA', id);
  const user = req.session.currentUser.username;

  if (!comment) {
    res.status(400);
    res.json({ message: 'Add a comment' });
    return;
  }
  const commentData = {
    user,
    message: comment
  };

  try {
    const event = await Event.findByIdAndUpdate(mongoId, { $push: { comments: commentData } });
    res.status(204);
    res.json({ message: 'Added comment' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
