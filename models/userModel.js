const mongoose = require('mongoose');
const crypto = require('crypto');

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
			select: false
		},
		gender: {
			type: String,
			enum: ['male', 'female']
		},
		photo: {
			type: String,
			default: ''
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		password: {
			type: String,
			required: [true, '密碼 未填寫'],
			minlength: 8,
			select: false
		},
		passwordConfirm: {
			type: String,
			select: false
		},
		passwordResetToken: String,
		createdAt: {
			type: Date,
			default: Date.now,
			select: false
		}
	},
	{
		versionKey: false
	}
);

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
