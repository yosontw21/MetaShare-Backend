const mongoose = require('mongoose');

const postScheam = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'user',
			required: [true, '無法找到使用者']
		},
		content: {
			type: String,
			required: [true, '內容 未填寫']
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		image: {
			type: String,
			default: ''
		},
		likes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'user'
			}
		]
	},
	{
		versionKey: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

postScheam.virtual('comments', {
	ref: 'comment',
	foreignField: 'postId',
	localField: '_id'
});

const Post = mongoose.model('post', postScheam);

module.exports = Post;
