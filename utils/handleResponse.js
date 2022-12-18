const successHandle = (data, statusCode, res) => {
	res.status(statusCode).json({
		status: 'success',
		data,
	});
};

module.exports = successHandle;
