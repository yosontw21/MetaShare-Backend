const appError = require('../config/appError');
const catchErrorAsync = require('../config/catchErrorAsync');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const generateSendJWT = (user, statusCode, res) => {
	let id = user._id;
	let name = user.name;
	let role = user.role;
	const token = jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_DAY
	});

	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		data: {
			token,
			name,
			role
		}
	});
};

exports.isAuth = catchErrorAsync(async (req, res, next) => {
	let token;
	const headerAuth = req.headers.authorization;

	if (headerAuth && headerAuth.startsWith('Bearer')) {
		token = headerAuth.split(' ')[1];
	}

	if (!token) {
		return appError(401, '你尚未登入', next);
	}

	const decoded = await new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
			if (err) {
				reject(err);
			} else {
				resolve(payload);
			}
		});
	});
	const currentUser = await User.findById(decoded.id);

	req.user = currentUser;
	next();
});

exports.isAdmin = catchErrorAsync(async (req, res, next) => {
	let userRole = req.user.role;
	if (userRole === 'admin') {
		next();
	} else {
		return appError(400, '你非管理員', next);
	}
});

exports.signup = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	let { name, gender, email, password, passwordConfirm } = userBody;
	if (!name || !email || !password || !passwordConfirm) {
		return appError(400, '欄位未填寫正確', next);
	}
	if (password !== passwordConfirm) {
		return appError(400, '密碼不一致', next);
	}
	if (!validator.isEmail(email)) {
		return appError(400, 'Email 格式不正確', next);
	}

	if (!validator.isLength(password, { min: 8 })) {
		return appError(400, '密碼不能低於 8 碼', next);
	}

	password = await bcrypt.hash(password, 12);

	const newUser = await User.create({
		name,
		gender,
		email,
		password
	});

	generateSendJWT(newUser, 201, res);
});

exports.login = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	let { email, password } = userBody;
	if (!email || !password) {
		return appError(400, '帳號密碼不可為空', next);
	}
	const user = await User.findOne({ email }).select('+password');
	const auth = await bcrypt.compare(password, user.password);
	if (!auth) {
		return appError(400, '您的密碼不正確', next);
	}
	generateSendJWT(user, 200, res);
});

exports.updatePassword = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	let id = req.user.id;
	let { passwordCurrent, password, passwordConfirm } = userBody;

	const user = await User.findById(id).select('+password');
	const auth = await bcrypt.compare(passwordCurrent, user.password);

	if (!validator.isLength(password, { min: 8 })) {
		return appError(400, '密碼不能低於 8 碼', next);
	}
	if (!auth) {
		return appError(400, '當前的密碼不正確', next);
	}
	if (password !== passwordConfirm) {
		return appError(400, '密碼不一致', next);
	}

	userBody.password = await bcrypt.hash(password, 12);

	user.password = userBody.password;
	user.passwordConfirm = userBody.passwordConfirm;

	user.passwordConfirm = undefined;

	await user.save();
	// newPassword = await bcrypt.hash(password, 12);

	// let user = await User.findByIdAndUpdate(id, {
	// 	password: newPassword
	// });
	generateSendJWT(user, 200, res);
});
