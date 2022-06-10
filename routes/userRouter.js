const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/google', authController.authGoogle);
router.get('/google/callback', authController.callbackGoogle);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
	'/updatePassword',
	authController.isAuth,
	authController.updatePassword
);

router
	.route('/profile')
	.patch(authController.isAuth, userController.updateProfile)
	.get(authController.isAuth, userController.getProfile);

router
	.route('/profile/:id')
	.get(authController.isAuth, userController.getPosts);

router
	.route('/:id/follows')
	.post(authController.isAuth, userController.addFollow)
	.delete(authController.isAuth, userController.delFollow);

router.get('/getLikesList', authController.isAuth, userController.getLikesList);

router.get(
	'/getFollowingList',
	authController.isAuth,
	userController.getFollowingList
);

// router.get(
// 	'/getFollowersList',
// 	authController.isAuth,
// 	userController.getFollowersList
// );

module.exports = router;
