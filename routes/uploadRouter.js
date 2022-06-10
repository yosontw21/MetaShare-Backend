const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authController = require('../controllers/authController');
const upload = require('../utils/image.js');

router
	.route('/')
	.post(authController.isAuth, upload, uploadController.uploadImage);

module.exports = router;
