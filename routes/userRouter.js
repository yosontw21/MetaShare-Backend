const express = require('express');
const userRouter = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch(
	'/updatePassword',
	authController.isAuth,
	authController.updatePassword
);

userRouter
	.route('/profile')
	.patch(authController.isAuth, userController.updateProfile)
	.get(authController.isAuth, userController.getProfile);

userRouter.route('/:id').get(authController.isAuth, userController.getPosts);

module.exports = userRouter;
