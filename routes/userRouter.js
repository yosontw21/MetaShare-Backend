const express = require('express');
const userRouter = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);

userRouter
	.route('/forgotPassword')
	.post(authController.isAuth, authController.forgotPassword);
userRouter
	.route('/resetPassword/:token')
	.patch(authController.isAuth, authController.resetPassword);

userRouter
	.route('/updatePassword')
	.patch(authController.isAuth, authController.updatePassword);

userRouter
	.route('/profile/updateProfile')
	.patch(authController.isAuth, userController.updateProfile);

userRouter
	.route('/profile/getProfile')
	.get(authController.isAuth, userController.getProfile);

module.exports = userRouter;
