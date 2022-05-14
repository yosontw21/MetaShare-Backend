const successHandle = (data, statusCode, res, result) => {
	res.status(statusCode).json({
		status: 'success',
		result,
		data
	});
};

module.exports = successHandle;
