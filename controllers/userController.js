const User = require('../models/userModel');
const Post = require('../models/postModel');
const catchErrorAsync = require('../utils/catchErrorAsync');
const successHandle = require('../utils/handleResponse');
const appError = require('../utils/appError');

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
	let { name, avatar, gender } = userBody;
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

exports.addFollow = catchErrorAsync(async (req, res, next) => {
	if (req.params.id === req.user.id) {
		return appError(400, '您無法追蹤自己', next);
	}

	await User.updateOne(
		{
			_id: req.user.id,
			'following.user': { $ne: req.params.id }
		},
		{
			$addToSet: { following: { user: req.params.id } }
		}
	);

	await User.updateOne(
		{
			_id: req.params.id,
			'followers.user': { $ne: req.user.id }
		},
		{
			$addToSet: { followers: { user: req.user.id } }
		}
	);
	res.status(201).json({
		status: 'success',
		message: '您已成功追蹤'
	});
});

exports.delFollow = catchErrorAsync(async (req, res, next) => {
	if (req.params.id === req.user.id) {
		return appError(400, '您無法取消追蹤自己', next);
	}
	await User.updateOne(
		{
			_id: req.user.id
		},
		{
			$pull: { following: { user: req.params.id } }
		}
	);
	await User.updateOne(
		{
			_id: req.params.id
		},
		{
			$pull: { followers: { user: req.user.id } }
		}
	);
	res.status(200).json({
		status: 'success',
		message: '您已成功取消追蹤'
	});
});

exports.getLikesList = catchErrorAsync(async (req, res, next) => {
	const likesList = await Post.find({
		likes: { $in: [req.user.id] }
	}).populate({
		path: 'user',
		select: 'name avatar _id'
	});
	successHandle(likesList, 200, res);
});

exports.getFollowingList = catchErrorAsync(async (req, res, next) => {
	const followingList = await User.findById({
		_id: req.user.id
	}).select('following followers')
	
	successHandle(followingList, 200, res);
});
