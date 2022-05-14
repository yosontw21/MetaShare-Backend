const express = require('express');
const postRouter = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

postRouter
	.route('/posts')
	.get(authController.isAuth, postController.getAllPosts)
	.delete(
		authController.isAuth,
		authController.isAdmin,
		postController.delAllPosts
	);

postRouter
	.route('/post')
	.post(authController.isAuth, postController.createPost);

postRouter
	.route('/post/:id')
	.get(authController.isAuth, postController.getPost)
	.delete(authController.isAuth, postController.delPost)
	.patch(authController.isAuth, postController.updatePost);

module.exports = postRouter;
