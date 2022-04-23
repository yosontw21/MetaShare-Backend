// models
const Post = require('../models/postModel');

// base
const { successHandle, errorHandle } = require('../base/responseHandle');

exports.getPosts = async (req, res) => {
	const post = await Post.find();
	successHandle(res, post);
};

exports.createPost = async (req, res) => {
	try {
		const post = req.body;
		const addPost = await Post.create({
			name: post.name,
			content: post.content,
			type: post.type,
			tags: post.tags,
			image: post.image
		});
		if (addPost.content) {
			successHandle(res, addPost);
		} else {
			errorHandle(res);
		}
	} catch (err) {
		errorHandle(res, err.message);
	}
};

exports.delAllPosts = async (req, res) => {
	const delAllPost = await Post.deleteMany({});
	successHandle(res, []);
};

exports.delPost = async (req, res) => {
	try {
		const id = req.params.id;
		const delSingle = await Post.findByIdAndDelete(id);
		if (delSingle !== null) {
			successHandle(res, delSingle);
		} else {
			errorHandle(res);
		}
	} catch (err) {
		errorHandle(res, err.message);
	}
};

exports.updatePost = async (req, res) => {
	try {
		const id = req.params.id;
		const postContent = req.body.content;

		const editPost = await Post.findByIdAndUpdate(
			id,
			{
				content: postContent
			},
			{
				new: true
			}
		);
		if (postContent !== undefined && editPost !== null) {
			successHandle(res, editPost);
		} else {
			errorHandle(res);
		}
	} catch (err) {
		errorHandle(res, err.message);
	}
};
