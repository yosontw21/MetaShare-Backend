// models
const Post = require('../models/postModel');
const User = require('../models/userModel');
const catchErrorAsync = require('../config/catchErrorAsync');

// config
const successHandle = require('../config/handleResponse');
const appError = require('../config/appError');

exports.getAllPosts = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 * #swagger.description = '取得全部貼文 API'
	 * #swagger.responses [200] = {
			description: '貼文資訊',
	 		schema: {
				"status": "success",
				"result": "目前貼文總共有 8 筆",
				"data": [
					{
						"_id": "626d50267f71a50bc7d3b46d",
						"user": {
							"_id": "626cfa4aa204668d46f82d49",
							"name": "Mary",
							"photo": "https://thumb.fakeface.rest/thumb_female_30_8ab46617938c195cadf80bc11a96ce906a47c110.jpg"
						},
						"content": "今天要完周作業",
						"image": "http:/mmyimagom/210/",
						"likes": 0,
						"comments": 0,
						"createdAt": "2022-04-30T15:05:10.598Z"
					}]
			 },
	 	 }
	 */
	let query = req.query;
	const timeSort = query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
	const limitPost = query.limit;

	const search = query.q !== undefined ? { content: new RegExp(query.q) } : {};
	const posts = await Post.find(search)
		.populate({
			path: 'user',
			select: 'name photo'
		})
		.sort(timeSort)
		.limit(limitPost);
	const result = `目前貼文總共有 ${posts.length} 筆`;
	posts.forEach((item) => {
		likesQun = item.likes.length;
		console.log(likesQun);
	});

	successHandle(posts, 200, res, result);
});

exports.getPost = catchErrorAsync(async (req, res, next) => {
	let id = req.params.id;

	const post = await Post.findById(id).populate({
		path: 'user',
		select: 'name photo'
	});

	if (!post) {
		return appError(400, '找不到貼文資料，或是 id 不正確', next);
	}

	successHandle(post, 200, res);
});

exports.createPost = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 * #swagger.description = '新增貼文 API'
	 * #swagger.parameters['body'] = {
	  	in: 'body',
			type: 'object',
	  	description: '資料格式',
	  	schema: {
	 			user: '626cfa4aa204668d46f82d49',
	  		content: '這是一段話'
	  	 }
	   }
	 }
	 */

	let post = req.body;
	let id = req.user.id;
	let { content, image } = post;
	const userId = await User.findById(id).exec();
	if (!content || content == '') {
		return appError(400, '內容 未填寫', next);
	}
	if (!id) {
		return appError(400, '使用者 格式錯誤', next);
	}
	if (userId === null) {
		return appError(400, '無法找到使用者，請重新確認', next);
	}
	if (!image) {
		return appError(400, '圖片 格式錯誤', next);
	}
	const addPost = await Post.create({
		user: req.user.id,
		content,
		image
	});
	successHandle(addPost, 201, res);
});

exports.delAllPosts = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 */
	if (req.originalUrl === '/api/posts/') {
		return appError(404, '無此網站路由', next);
	}
	await Post.deleteMany({});
	successHandle([], 200, res);
});

exports.delPost = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 * #swagger.description = '刪除單筆貼文 API'
	 * #swagger.security = [{
	 			apiKeyAuth: []
	 }]
	 */

	let postId = req.params.id;
	let userId = req.user.id;

	const post = await Post.findById(postId).populate({
		path: 'user',
		select: 'name photo'
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
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 */

	let postId = req.params.id;
	let userId = req.user.id;
	let post = req.body;

	let { content, image } = post;

	if (!content || content == '') {
		return appError(400, 'Content 未填寫', next);
	}
	if (!image) {
		return appError(400, 'image 格式錯誤', next);
	}

	const editPost = await Post.findByIdAndUpdate(
		postId,
		{ ...post },
		{
			new: true
		}
	).populate({
		path: 'user',
		select: 'name photo'
	});
	console.log(userId);

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
	const userID = req.user.id;
	await Post.findByIdAndUpdate(
		{ _id },
		{
			$addToSet: { likes: userID }
		}
	);
	res.status(201).json({
		status: 'success',
		postId: _id,
		userID
	});
	// successHandle(likePost, 201, res);
});

exports.delLikesPost = catchErrorAsync(async (req, res, next) => {
	const _id = req.params.id;
	const userID = req.user.id;
	await Post.findByIdAndUpdate(
		{ _id },
		{
			$pull: { likes: userID }
		}
	);
	res.status(201).json({
		status: 'success',
		postId: _id,
		userID
	});
});
