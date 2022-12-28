const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
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

postSchema.virtual('comments', {
	ref: 'comment',
	foreignField: 'postId',
	localField: '_id'
});

postSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'user',
		select: '-following -followers -email'
	});
	next();
});

postSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'likes',
		select: '-following -followers -personalInfo -email'
	});
	next();
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
