'use strict';

const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'ivanq',
  api_key: 535979413418358,
  api_secret: 'VBZ2QS4XaGD5aWFk2G0N-iFVgEQ'
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'demo',
  allowedFormats: ['jpg', 'png']
});

const parser = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      req.fileValidationError = true;
      return cb(null, false, new Error('Wrong file type uploaded'));
    }
    cb(null, true);
  }
});

module.exports = parser;
