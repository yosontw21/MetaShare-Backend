// models
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

// utils
const successHandle = require('../utils/handleResponse');
const appError = require('../utils/appError');
const catchErrorAsync = require('../utils/catchErrorAsync');

exports.getAllPosts = catchErrorAsync(async (req, res, next) => {
	let query = req.query;
	const timeSort = query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
	const limitPost = query.limit;

	const search = query.q !== undefined ? { content: new RegExp(query.q) } : {};
	const posts = await Post.find(search)
		.populate({
			path: 'user',
			select: 'name avatar'
		})
		.populate({
			path: 'comments'
		})
		.sort(timeSort)
		.limit(limitPost);
	successHandle(posts, 200, res);
});

exports.getUserPosts = catchErrorAsync(async (req, res, next) => {
	let query = req.query;
	const timeSort = query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
	const limitPost = query.limit;

	const userId = req.params.id;
	const userPosts = await Post.find({ user: userId })
		.populate({
			path: 'user',
			select: 'name avatar'
		})
		.populate({
			path: 'comments'
		})
		.sort(timeSort)
		.limit(limitPost);

	if (!userPosts) {
		return appError(400, '找不到使用者資料 id 不正確', next);
	}

	successHandle(userPosts, 200, res);
});

exports.getPost = catchErrorAsync(async (req, res, next) => {
	const userId = req.params.id;

	const post = await Post.findById(userId)
		.populate({
			path: 'user',
			select: 'name avatar'
		})
		.populate({
			path: 'comments'
		});

	if (!post) {
		return appError(400, '找不到貼文資料，或是 id 不正確', next);
	}

	successHandle(post, 200, res);
});

exports.createPost = catchErrorAsync(async (req, res, next) => {
	let post = req.body;
	let id = req.user.id;
	let { content, image } = post;
	const userId = await User.findById(id).exec();
	if (!content || content == '') {
		return appError(400, 'Content 未填寫', next);
	}
	if (!id) {
		return appError(400, '使用者 格式錯誤', next);
	}
	if (userId === null) {
		return appError(400, '無法找到使用者，請重新確認', next);
	}
	const addPost = await Post.create({
		user: req.user.id,
		content,
		image
	});
	successHandle(addPost, 201, res);
});

exports.delAllPosts = catchErrorAsync(async (req, res, next) => {
	if (req.originalUrl === '/api/posts/') {
		return appError(404, '無此網站路由', next);
	}
	await Post.deleteMany({});
	successHandle([], 200, res);
});

exports.delPost = catchErrorAsync(async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user.id;

	const post = await Post.findById(postId).populate({
		path: 'user',
		select: 'name avatar'
	});

	if (post.user.id !== userId) {
		return appError(400, '你無法刪除無他使用者貼文', next);
	}

	const delSingle = await Post.findByIdAndDelete(postId);

	if (!delSingle) {
		return appError(400, '找不到 id，請重新確認', next);
	}

	successHandle(delSingle, 200, res);
});

exports.updatePost = catchErrorAsync(async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user.id;
	let post = req.body;
	const { content, image } = post;

	if (!content || content == '') {
		return appError(400, 'Content 未填寫', next);
	}
	// if (!image) {
	// 	return appError(400, 'image 格式錯誤', next);
	// }

	const editPost = await Post.findByIdAndUpdate(
		postId,
		{ ...post },
		{
			new: true
		}
	).populate({
		path: 'user',
		select: 'name avatar'
	});

	if (!editPost) {
		return appError(400, '找不到 id，請重新確認', next);
	}

	if (editPost.user.id !== userId) {
		return appError(400, '你無法編輯無他使用者貼文', next);
	}
	successHandle(editPost, 200, res);
});

exports.likesPost = catchErrorAsync(async (req, res, next) => {
	const _id = req.params.id;
	const userId = req.user.id;
	await Post.findByIdAndUpdate(
		{
			_id
		},
		{
			$addToSet: { likes: userId }
		}
	);
	res.status(201).json({
		status: 'success',
		postId: _id,
		userId
	});
	// successHandle(likePost, 201, res);
});

exports.delLikesPost = catchErrorAsync(async (req, res, next) => {
	const _id = req.params.id;
	const userId = req.user.id;
	await Post.findByIdAndUpdate(
		{ _id },
		{
			$pull: { likes: userId }
		}
	);
	res.status(200).json({
		status: 'success',
		postId: _id,
		userId
	});
});

exports.createPostComment = catchErrorAsync(async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user.id;
	const { comment } = req.body;
	if (!comment || comment == '') {
		return appError(400, 'Comment 未填寫', next);
	}

	const post = await Post.findById(postId);

	if (post === null) {
		return appError(400, '無法找到此貼文，請重新確認', next);
	}
	const newComment = await Comment.create({
		postId,
		userId,
		comment
	});

	// await Comment.populate(newComment, {
	// 	path: 'user',
	// 	select: '_id -following -followers'
	// });

	res.status(201).json({
		status: 'success',
		data: {
			comments: newComment
		}
	});
});

exports.updatePostComment = catchErrorAsync(async (req, res, next) => {
	const commentId = req.params.id;
	const userId = req.user.id;
	const { comment } = req.body;
	const editComment = await Comment.findByIdAndUpdate(
		commentId,
		{ comment },
		{
			new: true
		}
	);

	if (!editComment) {
		return appError(400, '找不到 id，請重新確認', next);
	}
	if (editComment.userId.id !== userId) {
		return appError(400, '你無法編輯無他使用者留言', next);
	}
	successHandle(editComment, 200, res);
});

exports.delPostComment = catchErrorAsync(async (req, res, next) => {
	const commentId = req.params.id;
	const userId = req.user.id;

	const commentUserId = await Comment.findById(commentId);
	// console.log(commentUserId);

	if (!commentUserId) {
		return appError(400, '找不到 id，請重新確認', next);
	}

	if (commentUserId.userId.id !== userId) {
		return appError(400, '你無法刪除其他使用者留言', next);
	} else {
		const delComment = await Comment.findByIdAndDelete(commentId);
		successHandle(delComment, 200, res);
	}
});
