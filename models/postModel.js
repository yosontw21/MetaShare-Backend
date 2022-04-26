const mongoose = require('mongoose');

const postScheam = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, '貼為姓名未填寫' ]
		},
		tags: [
			{
				type: String,
				required: [ true, '貼文標籤 tags 未填寫' ]
			}
		],
		type: {
			type: String,
			enum: [ 'group', 'person' ],
			required: [ true, '貼文類型 type 未填寫，或請輸入 group 或是 person' ]
		},
		content: {
			type: String,
			required: [ true, 'Content 未填寫' ]
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		image: {
			type: String,
			default: ''
		},
		likes: {
			type: Number,
			default: 0
		},
		comments: {
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
