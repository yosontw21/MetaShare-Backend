const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

router
	.route('/posts')
	.get(authController.isAuth, postController.getAllPosts)
	.delete(
		authController.isAuth,

		postController.delAllPosts
	);

router.route('/post').post(authController.isAuth, postController.createPost);

router
	.route('/post/:id')
	.get(authController.isAuth, postController.getPost)
	.delete(authController.isAuth, postController.delPost)
	.patch(authController.isAuth, postController.updatePost);

router.get(
	'/posts/user/:id',
	authController.isAuth,
	postController.getUserPosts
);

router
	.route('/post/:id/likes')
	.post(authController.isAuth, postController.likesPost)
	.delete(authController.isAuth, postController.delLikesPost);

router
	.route('/post/:id/comments')
	.get(authController.isAuth, postController.getPostComments)
	.post(authController.isAuth, postController.createPostComment)
	.patch(authController.isAuth, postController.updatePostComment)
	.delete(authController.isAuth, postController.delPostComment);

module.exports = router;
