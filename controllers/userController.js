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

	successHandle(posts, 200, res);
});

// exports.getUsers = catchErrorAsync(async (req, res, next) => {
// 	const Users = await User.find({}).sort({ name: 1 });
// 	successHandle(Users, 200, res);
// });

exports.getMyProfile = catchErrorAsync(async (req, res, next) => {
	const myProfile = await User.findById(req.user.id);
	if (!myProfile) {
		return appError(400, '查無此用戶', next);
	}
	successHandle(myProfile, 200, res);
});

exports.getOtherProfile = catchErrorAsync(async (req, res, next) => {
	const { id } = req.params;

	const OtherProfile = await User.findById(id);
	if (!OtherProfile) {
		return appError(400, '查無此用戶', next);
	}
	successHandle(OtherProfile, 200, res);
});

exports.updateProfile = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	let id = req.user.id;
	let { name, avatar, personalInfo } = userBody;
	if (!name) {
		return appError(400, '名字不可為空', next);
	}
	const editProfile = await User.findByIdAndUpdate(
		id,
		{ name, avatar, personalInfo },
		{
			new: true
		}
	).select(['-following', '-followers']);
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

exports.delFollowers = catchErrorAsync(async (req, res, next) => {
	await User.updateOne(
		{
			_id: req.user.id
		},
		{
			$pull: { followers: { user: req.params.id } }
		}
	);
	await User.updateOne(
		{
			_id: req.params.id
		},
		{
			$pull: { following: { user: req.user.id } }
		}
	);
	res.status(200).json({
		status: 'success',
		message: '您已成功取消粉絲'
	});
});

exports.getLikesList = catchErrorAsync(async (req, res, next) => {
	const likesList = await Post.find(
		{
			likes: { $in: [req.user.id] }
		},
		{
			content: false,
			image: false,
			likes: false
		}
	).populate({
		path: 'user',
		select: 'name avatar _id'
	});
	successHandle(likesList, 200, res);
});

exports.getFollowingList = catchErrorAsync(async (req, res, next) => {
	const followingList = await User.findById({
		_id: req.user.id
	}).select('-followers');

	successHandle(followingList, 200, res);
});

exports.getFollowersList = catchErrorAsync(async (req, res, next) => {
	const followersList = await User.findById({
		_id: req.user.id
	}).select('-following');

	successHandle(followersList, 200, res);
});
