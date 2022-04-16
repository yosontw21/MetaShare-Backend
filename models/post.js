const mongoose = require('mongoose');
const postScheam = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, '內容未填寫' ]
		},
		content: {
			type: String,
			required: [ true, '內容未填寫' ]
		},
		createdAt: {
			type: Date,
			default: Date.now,
			select: false
		},
		image: {
			type: String,
			default: ''
		},
		likes: {
			type: Number,
			default: 0
		}
	},
	{
		versionKey: false,
		collection: 'post'
	}
);

const Post = mongoose.model('', postScheam);

module.exports = Post;
