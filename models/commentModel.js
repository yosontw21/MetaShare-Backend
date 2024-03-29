const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: [true, '留言內容不得為空']
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'user',
			required: [true, '使用者 ID 必填']
		},
		postId: {
			type: mongoose.Schema.ObjectId,
			ref: 'post',
			required: [true, '貼文 ID 必填']
		}
	},
	{
		versionKey: false
	}
);

commentsSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'userId',
		select: '_id -following -followers -email'
	});
	next();
});

const Comment = mongoose.model('comment', commentsSchema);

module.exports = Comment;
