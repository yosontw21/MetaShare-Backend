// 自定義的 Error 的錯誤 Production
const resErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: 'Error',
			message: err.message
		});
	} else {
		// 記錄 log 錯誤
		console.error('程式出現異常', err);
		res.status(500).json({
			status: 'Error',
			message: '系統錯誤，請洽系統管理員'
		});
	}
};

// 開發環境錯誤 Dev
const resErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		message: err.message,
		error: err,
		stack: err.stack
	});
};

// 驗證錯誤
const handleValidationError = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	err.message = `${errors.join('、')}，請重新確認!`;
	err.isOperational = true;
};

const handleCastError = (err) => {
	err.message = `無效的 ID，請重新確認`;
	err.isOperational = true;
};

// 錯誤處理
const handleError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	// dev
	if (process.env.NODE_ENV === 'dev') {
		return resErrorDev(err, res);
	}
	// production
	if (process.env.NODE_ENV === 'production') {
		if (err.name === 'ValidationError') {
			handleValidationError(err);
			return resErrorProd(err, res);
		}
		if (err.name === 'CastError') {
			handleCastError(err);
			return resErrorProd(err, res);
		}

		resErrorProd(err, res);
	}
};

module.exports = handleError;
