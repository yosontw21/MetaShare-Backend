const catchErrorAsync = require('../config/catchErrorAsync');
const User = require('../models/userModel');
const successHandle = require('../config/handleResponse');

exports.getProfile = catchErrorAsync(async (req, res, next) => {
	let id = req.user.id;
	const user = await User.findById(id);
	successHandle(user, 200, res);
});

exports.updateProfile = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	let id = req.user.id;
	let { name, photo, gender } = userBody;
	const editProfile = await User.findByIdAndUpdate(
		id,
		{ ...userBody },
		{
			new: true
		}
	);
	successHandle(editProfile, 200, res);
});
