const mongoose = require('mongoose');
const app = require('./app');

const dotenv = require('dotenv');
dotenv.config({
	path: './config.env'
});

const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB)
	.then(() => console.log('connected to the Database...'))
	.catch((err) => console.log(err));

const port = process.env.PORT;
app.listen(port, () => {
	console.log('running Local Server...');
});

// Error 錯誤回傳訊息
app.use((req, res, next) => {
	res.status(404).json({
		status: 'ERROR',
		message: '找不到網頁 404 Not Found，請重新確認'
	});
});

app.use((err, req, res, next) => {
	const errorMsg = err.message;
	res.status(500).json({
		status: 'ERROR',
		message: errorMsg
	});
});
