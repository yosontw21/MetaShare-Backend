const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const appError = require('../utils/appError');

const userScheam = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, '姓名 未填寫']
		},
		email: {
			type: String,
			required: [true, 'Email 未填寫'],
			unique: true,
			lowercase: true,
			select: false,
			validate: [validator.isEmail, 'Email 格式不正確']
		},
		avatar: {
			type: String,
			default: ''
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		followers: [
			{
				user: {
					type: mongoose.Schema.ObjectId,
					ref: 'user'
				},
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		following: [
			{
				user: {
					type: mongoose.Schema.ObjectId,
					ref: 'user'
				},
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		password: {
			type: String,
			required: [true, '密碼 未填寫'],
			minlength: 8,
			select: false
		},
		passwordConfirm: {
			type: String,
			validate: {
				validator: function(el) {
					return el === this.password;
				},
				message: '密碼不一致，請重新確認'
			}
		},
		passwordResetToken: String,
		createdAt: {
			type: Date,
			default: Date.now,
			select: false
		},
		googleId: String
	},
	{
		versionKey: false
	}
);


// 密碼驗證加密
userScheam.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	if (
		!validator.isStrongPassword(this.password, {
			minLength: 8,
			minUppercase: 0,
			minSymbols: 0
		})
	) {
		return appError(400, '密碼不能低於 8 碼，並中英混合', next);
	}
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

// 重置密碼驗證
userScheam.methods.createResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	return resetToken;
};

const User = mongoose.model('user', userScheam);

module.exports = User;
