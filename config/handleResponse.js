const successHandle = (res, data, result) => {
	res.status(200).json({
		status: 'success',
		result,
		data
	});
};

module.exports = successHandle;
