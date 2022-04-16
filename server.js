const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// models
const Post = require('./models/post');

// controllers
const headers = require('./controllers/header');
const errorHandle = require('./controllers/errorHandle');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWARD
);

mongoose
	.connect(DB)
	.then(() => console.log('成功連線到資料庫'))
	.catch(() => console.log('連線失敗'));

const requestListener = async (req, res) => {
	const reqUrl = req.url;
	const reqMethod = req.method;
	const urlId = req.url.startsWith('/posts/');

	let body = '';
	req.on('data', (chuck) => {
		body += chuck;
	});
	if (reqUrl == '/posts' && reqMethod == 'GET') {
		const post = await Post.find();
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				post
			})
		);
		res.end();
	} else if (reqUrl == '/posts' && reqMethod == 'POST') {
		req.on('end', async () => {
			try {
				const post = JSON.parse(body);
				if (post.image !== undefined) {
					const addPost = await Post.create({
						name: post.name,
						content: post.content,
						image: post.image
					});
					res.writeHead(200, headers);
					res.write(
						JSON.stringify({
							status: 'success',
							post: addPost
						})
					);
					res.end();
				} else {
					errorHandle(res);
				}
			} catch (err) {
				errorHandle(res, err.message);
			}
		});
	} else if (reqUrl == '/posts' && reqMethod == 'DELETE') {
		const delAllPost = await Post.deleteMany({});
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				post: [],
				message: '刪除所有資料成功'
			})
		);
		res.end();
	} else if (urlId && reqMethod == 'DELETE') {
		try {
			const id = req.url.split('/').pop();
			const delSingle = await Post.findByIdAndDelete(id);
			if (delSingle !== null) {
				res.writeHead(200, headers);
				res.write(
					JSON.stringify({
						status: 'success',
						delSingle,
						message: '資料單筆刪除成功'
					})
				);
				res.end();
			} else {
				errorHandle(res);
			}
		} catch (err) {
			errorHandle(res, err.message);
		}
	} else if (urlId && reqMethod == 'PATCH') {
		req.on('end', async () => {
			try {
				const id = req.url.split('/').pop();
				const editContent = JSON.parse(body).content;
				const editPostContent = await Post.findByIdAndUpdate(id, {
					content: editContent
				});
				if (editContent !== undefined && editPostContent !== null) {
					res.writeHead(200, headers);
					res.write(
						JSON.stringify({
							status: 'success',
							editPostContent,
							message: '修改單筆刪除成功'
						})
					);
					res.end();
				} else {
					errorHandle(res);
				}
			} catch (err) {
				errorHandle(res, err.message);
			}
		});
	} else if (reqMethod == 'OPTIONS') {
		res.writeHead(200, headers);
		res.end();
	} else {
		res.writeHead(404, headers);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: '路徑不正確'
			})
		);
		res.end();
	}
};

const server = http.createServer(requestListener);
const port = process.env.PORT || 3005;
server.listen(port);
