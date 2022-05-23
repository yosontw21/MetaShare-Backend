const appError = require('../config/appError');
const catchErrorAsync = require('../config/catchErrorAsync');
const User = require('../models/userModel');
const sendEmail = require('../config/email');
const successHandle = require('../config/handleResponse');
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

	if (
		!validator.isStrongPassword(password, {
			minLength: 8,
			minUppercase: 0,
			minSymbols: 0
		})
	) {
		return appError(400, '密碼不能低於 8 碼，並中英混合', next);
	}

	password = await bcrypt.hash(password, 12);

	const newUser = await User.create({
		name,
		gender,
		email,
		password
	});

	const html = `
	<h2>註冊成功</h2>
	<p>哈囉， ${name} 歡迎來到 MetaWall 社交圈</p>`;

	await sendEmail({
		email,
		subject: '恭喜您，註冊成功',
		html
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

	if (
		!validator.isStrongPassword(password, {
			minLength: 8,
			minUppercase: 0,
			minSymbols: 0
		})
	) {
		return appError(400, '密碼不能低於 8 碼，並中英混合', next);
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

exports.forgotPassword = catchErrorAsync(async (req, res, next) => {
	let email = req.body.email;

	let user = await User.findOne({ email });
	if (!user) {
		return appError(400, '沒有此 email 帳號', next);
	}
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_DAY
	});
	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/users/resetPassword/${token}`;

	await user.save();

	const html = `
	<h2>重置密碼</h2>
	<p>哈囉， ${user.name} 忘記密碼了嗎?</p>
	<p>要完成密碼重置過程，請訪問以下連結:</p>
	<p>${resetURL}</p>
	<p>如果您沒有要求重設密碼，請忽略此信件。</p>
	<p>除非您訪問上面的連結並重設密碼，否則您的密碼將不會被更改。</p>`;

	await sendEmail({
		email,
		subject: '重置新密碼通知',
		html
	});
	const message = '成功寄出郵件';
	successHandle(message, 200, res);
});

exports.resetPassword = catchErrorAsync(async (req, res, next) => {
	// let userBody = req.body;
	// let token = req.params.token;
	// let { password, passwordConfirm } = userBody;
	// const user = await User.findOne({ token }).select('+password');
	// console.log(user.name);
	// const decoded = await new Promise((resolve, reject) => {
	// 	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
	// 		if (err) {
	// 			reject(err);
	// 		} else {
	// 			resolve(payload);
	// 		}
	// 	});
	// });
	// const currentUser = await User.findById(decoded.id);

	// req.user = currentUser;

	// userBody.password = await bcrypt.hash(password, 12);

	// user.password = userBody.password;
	// user.passwordConfirm = userBody.passwordConfirm;
	// user.passwordConfirm = undefined;

	// await user.save();

	// successHandle(token, 200, res);
});
