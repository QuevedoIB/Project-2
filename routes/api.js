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

  const user = req.session.currentUser.username;

  const image = req.session.currentUser.imageUrl;

  if (!comment) {
    res.status(400);
    res.json({ message: 'Add a comment' });
    return;
  }
  const commentData = {
    user,
    message: comment,
    userImage: image
  };

  try {
    const event = await Event.findByIdAndUpdate(mongoId, { $push: { comments: commentData } }, { new: true });
    res.status(200);
    return res.json(event.comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
