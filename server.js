const http = require('http');
const Post = require('./models/post');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
		'Content-Type': 'application/json'
	};
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
			} catch (err) {
				res.writeHead(400, headers);
				res.write(
					JSON.stringify({
						status: 'ERROR',
						message: '欄位沒有正確',
						err: err
					})
				);
				res.end();
			}
		});
	} else if (reqUrl == '/posts' && reqMethod == 'DELETE') {
		const delPost = await Post.deleteMany({});
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				post: [],
				message: '資料刪除成功'
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
						message: '資料單筆刪除成功'
					})
				);
				res.end();
			} else {
				res.writeHead(400, headers);
				res.write(
					JSON.stringify({
						status: 'ERROR',
						message: '欄位沒有正確，或是找不到 id'
					})
				);
				res.end();
			}
		} catch (err) {
			res.writeHead(400, headers);
			res.write(
				JSON.stringify({
					status: 'ERROR',
					message: '欄位沒有正確，或是找不到 id'
				})
			);
			res.end();
		}
	} else if (urlId && reqMethod == 'PATCH') {
		req.on('end', async () => {
			try {
				const id = req.url.split('/').pop();
				const editContent = JSON.parse(body).content;
				if (editContent !== undefined) {
					const editPostContent = await Post.findByIdAndUpdate(id, {
						content: editContent
					});
					res.writeHead(200, headers);
					res.write(
						JSON.stringify({
							status: 'success',
							editPostContent
						})
					);
					res.end();
				} else {
					res.writeHead(400, headers);
					res.write(
						JSON.stringify({
							status: 'ERROR',
							message: '欄位沒有正確，或是找不到 id'
						})
					);
					res.end();
				}
			} catch (err) {
				res.writeHead(400, headers);
				res.write(
					JSON.stringify({
						status: 'ERROR',
						message: '欄位沒有正確，或是找不到 id'
					})
				);
				res.end();
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
server.listen(3005);
