const mongoose = require('mongoose');
const app = require('./app');


const dotenv = require('dotenv');
dotenv.config({
	path: './config.env'
});


// 程式出現重大錯誤時
process.on('uncaughtException', (err) => {
	// 把錯誤記錄起來，處理完之後，關閉 process
	console.error('Uncaughted Exception，未捕捉到的異常');
	console.error(err);
	console.error('錯誤名稱:', err.name);
	console.error('錯誤訊息:', err.message);
	process.exit(1);
});


const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB)
	.then(() => console.log('connected to the Database...'))
	.catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('running Local Server...');
});

process.on('unhandledRejection', (err, promise) => {
	console.error('Unhandled Rejection, 未處理的拒絕');
	console.error('錯誤名稱:', err.name);
	console.error('錯誤訊息:', err.message);
});
