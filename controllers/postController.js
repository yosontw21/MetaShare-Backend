// models
const Post = require('../models/postModel');

// base
const { successHandle, errorHandle } = require('../base/responseHandle');

exports.getPosts = async (req, res) => {
	const posts = await Post.find();
	const result = `目前貼文總共有 ${posts.length} 筆`;
	successHandle(res, posts, result);
};

exports.createPost = async (req, res) => {
	try {
		const post = req.body;
		// const [ name, content, type, tags, image ] = Object.values(post);
		const { name, content, type, tags, image } = post;
		const addPost = await Post.create({
			name,
			content,
			type,
			tags,
			image
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
		const post = req.body;
		// const [ content, type, tags, image ] = Object.values(post);
		const { content, type, tags, image } = post;
		const editPost = await Post.findByIdAndUpdate(
			id,
			{
				content,
				type,
				tags,
				image
			},
			{
				new: true
			}
		);
		if (content !== undefined && editPost !== null) {
			successHandle(res, editPost);
		} else {
			errorHandle(res);
		}
	} catch (err) {
		errorHandle(res, err.message);
	}
};
