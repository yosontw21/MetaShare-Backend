const express = require('express');
const postRouter = express.Router();

const postController = require('../controllers/postController');

postRouter
	.route('/')
	.get(postController.getAllPosts)
	.post(postController.createPost)
	.delete(postController.delAllPosts)

postRouter
	.route('/:id')
	.get(postController.getPost)
	.delete(postController.delPost)
	.patch(postController.updatePost);

module.exports = postRouter;
