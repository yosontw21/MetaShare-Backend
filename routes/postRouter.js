const express = require('express');
const postRouter = express.Router();

const postController = require('./../controllers/postController');

postRouter
	.route('/')
	.get(postController.getPosts)
	.post(postController.createPost)
	.delete(postController.delAllPosts);
postRouter
	.route('/:id')
	.delete(postController.delPost)
	.patch(postController.updatePost);

module.exports = postRouter;
