'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');
const Items = require('../models/Items');
const ObjectId = require('mongodb').ObjectID;
const parser = require('../helpers/file-upload');

const { requireLogged } = require('../middlewares/auth');

router.get('/', requireLogged, async (req, res, next) => {
  const user = req.session.currentUser;
  const currentDate = new Date().toISOString();
  try {
    const owned = await Events.find({ owner: user._id });
    const participating = await Events.find({ attendees: { '$in': [user._id] } });
    const finished = await Events.find({ date: { $lt: currentDate } });
    const events = { owned, participating, finished };
    res.render('events/list', { events, user });
  } catch (err) {
    next(err);
  }
});

router.get('/search-event', requireLogged, async (req, res, next) => {
  const { name } = req.query;

  try {
    const eventsSearched = await Events.find({ $or: [{ name: name }, { username: name }] });
    if (!eventsSearched) {
      const data = {
        messages: req.flash('validation')
      };
      req.flash('validation', 'Incorrect user');
      res.redirect('/events', data);
      return;
    }
    const user = req.session.currentUser;
    const currentDate = new Date().toISOString();
    const owned = await Events.find({ owner: user._id });
    const participating = await Events.find({ attendees: { '$in': [user._id] } });
    const finished = await Events.find({ date: { $lt: currentDate } });
    const events = { owned, participating, finished };

    res.render('events/list', { events, user, eventsSearched });
  } catch (err) {
    next(err);
  }
});

router.get('/new', requireLogged, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('profile/new', data);
});

router.post('/add', requireLogged, parser.single('image'), async (req, res, next) => {
  let owner = req.session.currentUser._id;
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.url;
  }

  const { name, description, location, date } = req.body;
  const event = { owner, name, description, location, date, imageUrl };
  if (!owner || !name || !location || !date) {
    // required fields flash
    req.flash('validation', 'Missing fields');
    res.redirect('/events/new');
    return;
  };
  try {
    const result = await Events.create(event);
    res.redirect(`/events/${result._id}`);
  } catch (err) {
    next(err);
  };
});

router.get('/:id', requireLogged, async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.session.currentUser._id;
  const data = {
    messages: req.flash('validation')
  };
  try {
    const event = await Events.findById(id).populate('owner').populate('attendees').populate('items').lean();
    let isCreator = false;
    if (event.owner._id.equals(currentUserId)) {
      isCreator = true;
    }

    event.attendees.forEach(attendee => {
      event.items.forEach(item => {
        item.carriers.forEach(carrier => {
          if (attendee._id.equals(carrier.user)) {
            if (!attendee.items) {
              attendee.items = [];
            }
            attendee.items.push({
              itemName: item.name,
              quantity: carrier.quantity
            });
          }
        });
      });
    });
    res.render('events/details', { event, isCreator, data });
  } catch (err) {
    next(err);
  }
});

router.post('/add-item', requireLogged, async (req, res, next) => {
  const { event, name, quantity } = req.body;
  const itemObject = { name, quantity, event };
  if (!name || !quantity || !event) {
    // required fields flash
    req.flash('validation', 'Missing fields');
    res.redirect(`/events/${event}`);
    return;
  };
  try {
    const item = await Items.create(itemObject);
    const itemId = item._id;
    const eventUpdate = await Events.findByIdAndUpdate(event, { $push: { items: itemId } }, { new: true });
    res.redirect(`/events/${event}`);
  } catch (err) {
    next(err);
  }
});

router.post('/take-item', requireLogged, async (req, res, next) => {
  const { quantity, name, event } = req.body;
  const user = req.session.currentUser;
  try {
    const itemArray = await Items.find({ $and: [{ name }, { event }] }).lean();
    if (itemArray) {
      const newQuantity = itemArray[0].quantity - parseInt(quantity);
      if (itemArray[0].carriers.length) {
        const checkUsers = itemArray[0].carriers.some(e => e.user == user._id);
        if (checkUsers) {
          const carrier = itemArray[0].carriers.map(carrierData => {
            if (carrierData.user == user._id) {
              let finalQuantity = parseInt(quantity) + carrierData.quantity;
              carrierData.quantity = finalQuantity;
            }
            return carrierData;
          });
          await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'carriers': carrier, 'quantity': newQuantity } }, { new: true });
          const itemQuantityUpdated = await Items.find({ $and: [{ name }, { event }] }).lean();
          if (itemQuantityUpdated[0].quantity < 1) {
            await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'status': '' } }, { new: true });
          }
          return res.redirect(`/events/${event}`);
        } else {
          const newCarrier = {
            user: user._id,
            quantity: quantity
          };
          await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'quantity': newQuantity } }, { new: true });
          await Items.findOneAndUpdate({ name }, { $push: { carriers: newCarrier } }, { new: true });
          const itemQuantityUpdated = await Items.find({ $and: [{ name }, { event }] }).lean();
          if (itemQuantityUpdated[0].quantity < 1) {
            await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'status': '' } }, { new: true });
          }
          return res.redirect(`/events/${event}`);
        }
      }
      const newCarrier = {
        user: user._id,
        quantity: quantity
      };
      await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'quantity': newQuantity } }, { new: true });
      await Items.findOneAndUpdate({ name }, { $push: { carriers: newCarrier } }, { new: true });
      const itemQuantityUpdated = await Items.find({ $and: [{ name }, { event }] }).lean();

      if (itemQuantityUpdated[0].quantity < 1) {
        await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'status': '' } }, { new: true });
      }
      res.redirect(`/events/${event}`);
    };
  } catch (err) {
    next(err);
  }
});

router.post('/delete-event', requireLogged, async (req, res, next) => {
  const user = req.session.currentUser;
  const { event } = req.body;
  try {
    const eventData = await Events.findById(event).populate('owner');
    const eventOwnerId = eventData.owner._id;
    if (eventOwnerId.equals(user._id)) {
      await Events.findByIdAndDelete(event);
      return res.redirect('/profile');
    }
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------

router.get('/:id/send-email', requireLogged, async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.session.currentUser;
  try {
    const event = await Events.findById(id).populate('attendees');
    res.render('events/send-email', { event, currentUser });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/send-email', requireLogged, async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.session.currentUser;
  const { subject, message } = req.body;
  try {
    const event = await Events.findById(id).populate('attendees');
    const attend = event.attendees;
    let mails = [];
    attend.forEach((att) => {
      mails.push(att.email);
    });
    /// ////////send email ////////////////
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ironsugarkane@gmail.com',
        pass: 'kanesugar1!'
      }
    });
    transporter.sendMail({
      from: 'Esplit project - pending invitation',
      to: mails,
      subject: subject,
      html: `<p>${message}</p><p><a href="http://localhost:3000/">Click here</a></p>`
    })
      .then(info => console.log(info))
      .catch(error => console.log(error));

    res.redirect(`/events/${id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
