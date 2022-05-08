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
	const query = req.query;
	const timeSort = query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
	const limitPost = query.limit;

	// function timeSort() {
	// 	const sort = req.query.timeSort;
	// 	if (sort === 'asc') {
	// 		return 'createdAt';
	// 	} else if (sort === 'desc') {
	// 		return '-createdAt';
	// 	}
	// }

	const search = query.q !== undefined ? { content: new RegExp(query.q) } : {};
	const posts = await Post.find(search)
		.populate({
			path: 'user',
			select: 'name photo'
		})
		.sort(timeSort)
		.limit(limitPost);
	const result = `目前貼文總共有 ${posts.length} 筆`;
	successHandle(res, posts, result);
});

exports.getPost = catchErrorAsync(async (req, res, next) => {
	const id = req.params.id;

	const post = await Post.findById(id).populate({
		path: 'user',
		select: 'name photo'
	});

	if (!post) {
		return appError(400, '找不到貼文資料，或是 id 不正確', next);
	}

	successHandle(res, post);
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

	const post = req.body;
	const { user, content, image } = post;
	const userId = await User.findById(user).exec();
	if (!content || content == '') {
		return appError(400, '內容 未填寫', next);
	}
	if (!user) {
		return appError(400, '使用者 格式錯誤', next);
	}
	if (userId === null) {
		return appError(400, '無法找到使用者，請重新確認', next);
	}
	if (!image) {
		return appError(400, '圖片 格式錯誤', next);
	}
	const addPost = await Post.create({
		...post
	});
	successHandle(res, addPost);
});

exports.delAllPosts = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 */
	if (req.originalUrl === '/posts/') {
		return appError(404, '無此網站路由', next);
	}
	await Post.deleteMany({});
	successHandle(res, []);
});

exports.delPost = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 * #swagger.description = '刪除單筆貼文 API'
	 * #swagger.security = [{
	 			apiKeyAuth: []
	 }]
	 */

	const id = req.params.id;
	const delSingle = await Post.findByIdAndDelete(id);
	if (!delSingle) {
		return appError(400, '找不到 id，請重新確認', next);
	}
	successHandle(res, delSingle);
});

exports.updatePost = catchErrorAsync(async (req, res, next) => {
	/**
	 * #swagger.tags = ['Posts - 貼文']
	 */

	const id = req.params.id;
	const post = req.body;
	const { content, image } = post;

	if (!content || content == '') {
		return appError(400, 'Content 未填寫', next);
	}
	if (!image) {
		return appError(400, 'image 格式錯誤', next);
	}

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

	if (!editPost) {
		return appError(400, '找不到 id，請重新確認', next);
	}
	successHandle(res, editPost);
});
