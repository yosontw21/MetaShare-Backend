// models
const Post = require('../models/postModel');
const User = require('../models/userModel');

// base
const { successHandle, errorHandle } = require('../base/responseHandle');

exports.getPosts = async (req, res) => {
	const query = req.query;
	const timeSort = query.timeSort == 'asc'   ? 'createdAt' : '-createdAt';
	// function timeSort() {
	// 	const sort = req.query.timeSort;
	// 	if (sort === 'asc') {
	// 		return 'createdAt';
	// 	} else if (sort === 'desc') {
	// 		return '-createdAt';
	// 	}
	// }

	const q = query.q !== undefined ? { content: new RegExp(query.q) } : {};
	const posts = await Post.find(q)
		.populate({
			path: 'user',
			select: 'name photo'
		})
		.sort(timeSort);
	const result = `目前貼文總共有 ${posts.length} 筆`;
	successHandle(res, posts, result);
};

exports.createPost = async (req, res) => {
	try {
		const post = req.body;
		// const [ name, content, type, tags, image ] = Object.values(post);
		const { user, content, image } = post;
		if (content) {
			const addPost = await Post.create({
				...post
			});
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
		const { content, image } = post;

		if (content && image) {
			const editPost = await Post.findByIdAndUpdate(
				id,
				{ ...post },
				{
					new: true
				}
			).populate({
				path: 'user',
				select: 'name photo'
			});
			if (editPost !== null) {
				successHandle(res, editPost);
			} else {
				errorHandle(res);
			}
		} else {
			errorHandle(res);
		}
	} catch (err) {
		errorHandle(res, err.message);
	}
};
