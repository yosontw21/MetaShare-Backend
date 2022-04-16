const headers = require('./header')

const errorHandle = (res) => {
	res.writeHead(400, headers);
	res.write(
		JSON.stringify({
			status: 'ERROR',
			message: '欄位沒有正確，或是找不到 id'
		})
	);
	res.end();
};

module.exports = errorHandle;