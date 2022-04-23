const successHandle = (res, data) => {
	res.status(200).json({
		status: 'success',
		data
	});
};

const errorHandle = (res, err) => {
	res.status(400).json({
		status: 'ERROR',
		message: '欄位沒有正確，或是找不到 id',
		err
	});
};

module.exports = { successHandle, errorHandle };
