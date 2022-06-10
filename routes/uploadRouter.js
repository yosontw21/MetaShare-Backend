const express = require('express');
const uploadController = require('../controllers/uploadController');
const authController = require('../controllers/authController');
const upload = require('../utils/image.js');
const router = express.Router();

router
	.route('/')
	.post(authController.isAuth, upload, uploadController.uploadImage);

module.exports = router;
