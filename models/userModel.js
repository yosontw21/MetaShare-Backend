const mongoose = require('mongoose');

const userScheam = new mongoose.Schema(
	{
		user: {
			type: String,
			required: [true, '姓名未填寫']
		},
		email: {
			type: String,
			required: [true, 'Email 未填寫'],
			unique: true,
			lowercase: true,
			select: false
		},
		photo: {
			type: String,
			default: ''
		}
	},
	{
		versionKey: false
	}
);

const User = mongoose.model('user', userScheam);

module.exports = User;
