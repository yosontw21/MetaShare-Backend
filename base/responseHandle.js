const headers = require('./header');

const handleSuccess = (res, data) => {
	res.writeHead(200, headers);
	res.write(
		JSON.stringify({
			status: 'success',
			data
		})
	);
	res.end();
};

const errorHandle = (res, err) => {
	res.writeHead(400, headers);
	res.write(
		JSON.stringify({
			status: 'ERROR',
			message: '欄位沒有正確，或是找不到 id',
			err
		})
	);
	res.end();
};

module.exports = {handleSuccess, errorHandle};
