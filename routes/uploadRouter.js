const express = require('express');
const uploadController = require('../controllers/uploadController');
const authController = require('../controllers/authController');
const upload = require('../config/image.js');
const uploadRouter = express.Router();

uploadRouter
	.route('/')
	.post(authController.isAuth, upload, uploadController.uploadImage);

module.exports = uploadRouter;
