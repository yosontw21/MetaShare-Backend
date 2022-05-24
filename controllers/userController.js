const catchErrorAsync = require('../config/catchErrorAsync');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const successHandle = require('../config/handleResponse');
const appError = require('../config/appError');

exports.getPosts = catchErrorAsync(async (req, res, next) => {
	const user = req.params.id;
	const posts = await Post.find({ user }).exec();

	if (!posts) {
		return appError(400, '找不到使用者資訊', next);
	}

	const result = `目前貼文總共有 ${posts.length} 筆`;
	successHandle(posts, 200, res, result);
});

exports.getProfile = catchErrorAsync(async (req, res, next) => {
	let id = req.user.id;
	const user = await User.findById(id);
	successHandle(user, 200, res);
});

exports.updateProfile = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	let id = req.user.id;
	let { name, photo, gender } = userBody;
	if (!name) {
		return appError(400, '名字不可為空', next);
	}
	if (!gender) {
		return appError(400, '性別不得為空', next);
	}
	const editProfile = await User.findByIdAndUpdate(
		id,
		{ ...userBody },
		{
			new: true
		}
	);
	successHandle(editProfile, 200, res);
});
