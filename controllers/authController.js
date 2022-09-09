const appError = require('../utils/appError');
const catchErrorAsync = require('../utils/catchErrorAsync');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const successHandle = require('../utils/handleResponse');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const generateSendJWT = (user, statusCode, res) => {
	let id = user._id;
	let name = user.name;
	let avatar = user.avatar;
	const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_DAY
	});
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 86400000),
		httpOnly: true
		// secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = false;
	res.cookie('jwt', token, cookieOptions);
	let userData = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 86400000),
		token,
		name,
		avatar
	};

	user.password = undefined;

	successHandle(userData, 201, res);
};

exports.isAuth = catchErrorAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return appError(401, '您尚未登入', next);
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

	if (!currentUser) {
		return next();
	}
	req.user = currentUser;
	next();
});

exports.check = async (req, res, next) => {
	generateSendJWT(req.user, false, res);
};

// exports.check = catchErrorAsync(async (req, res, next) => {
// 	const token = req.cookies.jwt;
// 	if (token) {
// 		try {
// 			const decoded = await new Promise((res, rej) => {
// 				jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
// 					if (err) {
// 						return next(appError(400, '認證失敗，請重新登入'));
// 					} else {
// 						res(payload);
// 					}
// 				});
// 			});

// 			const currentUser = await User.findById(decoded.id);

// 			if (!currentUser) {
// 				return next();
// 			}
// 			req.locals.user = currentUser;
// 			return next();
// 		} catch (err) {
// 			return next();
// 		}
// 	}
// 	next();
// });

exports.isAdmin = catchErrorAsync(async (req, res, next) => {
	const userRole = req.user.role;
	if (userRole === 'admin') {
		next();
	} else {
		return appError(400, '你非管理員', next);
	}
});

exports.signup = catchErrorAsync(async (req, res, next) => {
	const { name, email, password, passwordConfirm } = req.body;
	if (!name || !email || !password || !passwordConfirm) {
		return appError(400, '欄位未填寫正確', next);
	}

	if (!validator.isEmail(email)) {
		return appError(400, 'Email 格式不正確', next);
	}

	if (password !== passwordConfirm) {
		return appError(400, '密碼不一致，請重新確認', next);
	}

	const newUser = await User.create({
		name,
		email,
		password
	});

	const html = `
	<img src="https://raw.githubusercontent.com/yosontw21/MetaShare/master/src/assets/images/1c9b3870.png" style="height: 54px;
    width: 270px;
    display: block;">
	<h2>恭喜您 ${name}，註冊成功</h2>
	<p>親愛的用戶您好， ${name} 歡迎來到 MetaShare 社交圈。</p>
	<p>很高興您加入我們，歡迎使用我們的服務。</p>`;

	await sendEmail({
		email,
		subject: '註冊成功通知',
		html
	});

	generateSendJWT(newUser, 201, res);
});

exports.login = catchErrorAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return appError(400, '欄位未正確填寫', next);
	}

	if (!validator.isEmail(email)) {
		return appError(400, 'Email 格式不正確', next);
	}

	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return appError(400, '您的帳號或密碼不正確', next);
	}

	const auth = await bcrypt.compare(password, user.password);
	if (!auth) {
		return appError(400, '您的帳號或密碼不正確', next);
	}
	generateSendJWT(user, 200, res);
});

exports.logout = (req, res, next) => {
	res.cookie('jwt', 'expires', {
		expires: new Date(Date.now() + 1 * 1000),
		httpOnly: true
	});
	res.clearCookie('jwt');
	successHandle('', 200, res);
};

exports.updatePassword = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	const id = req.user.id;
	const { passwordCurrent, password, passwordConfirm } = userBody;

	const user = await User.findById(id).select('+password');
	const auth = await bcrypt.compare(passwordCurrent, user.password);

	if (!auth) {
		return appError(400, '當前的密碼不正確', next);
	}

	user.password = userBody.password;
	user.passwordConfirm = userBody.passwordConfirm;

	await user.save();
	generateSendJWT(user, 200, res);
});

exports.forgotPassword = catchErrorAsync(async (req, res, next) => {
	const email = req.body.email;

	const user = await User.findOne({ email });
	if (!user) {
		return appError(400, '沒有此 email 帳號', next);
	}

	const resetToken = user.createResetToken();

	const resetURL = `https://yosontw21.github.io/MetaShare/#/resetpassword/${resetToken}`;

	await user.save();

	const html = `
		<img src="https://raw.githubusercontent.com/yosontw21/MetaShare/master/src/assets/images/1c9b3870.png" style="height: 54px;
    width: 270px;
    display: block;
		margin-bottom: 12px;
		">
	<h2>重置密碼</h2>
	<p>哈囉， ${user.name} 忘記密碼了嗎?</p>
	<p>要完成密碼重置過程，請訪問以下連結:</p>
	<p>${resetURL}</p>
	<p>如果您沒有要求重設密碼，請忽略此信件。</p>
	<p>除非您訪問上面的連結並重設密碼，否則您的密碼將不會被更改。</p>`;

	await sendEmail({
		email,
		subject: `哈囉，${user.name}，重置新密碼通知`,
		html
	});
	const message = '成功寄出郵件';
	successHandle(message, 200, res);
});

exports.resetPassword = catchErrorAsync(async (req, res, next) => {
	let userBody = req.body;
	const { password, passwordConfirm } = userBody;
	const resetToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: resetToken
	});

	if (!user) {
		return appError(400, '無效的連結', next);
	}

	if (userBody.password !== userBody.passwordConfirm) {
		return appError(400, '密碼不一致，請重新確認', next);
	}

	user.password = userBody.password;
	user.passwordConfirm = userBody.passwordConfirm;
	user.passwordResetToken = undefined;

	await user.save();

	generateSendJWT(user, 200, res);
});
