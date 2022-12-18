// 自定義的 Error 的錯誤 Prod
const resErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		// 記錄 log 錯誤
		// console.error('程式出現異常', err);
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
	err.status = 'Error';
	err.message = `${errors.join('、')}，請重新確認!`;
	err.isOperational = true;
};

const handleCastError = (err) => {
	err.status = 'Error';
	err.message = `無效的 ID，請重新確認`;
	err.isOperational = true;
};

const handleConfirmEmail = (err) => {
	err.status = 'Error';
	err.message = `Email 已有人使用，請重新註冊`;
	err.isOperational = true;
};

const handleSyntaxError = (err) => {
	err.statusCode = 400;
	err.status = 'Error';
	err.message = `資料格式錯誤，請重新確認`;
	err.isOperational = true;
};

const handleJWTError = (err) => {
	err.statusCode = 401;
	err.status = 'Error';
	err.message = `無效的 Token，請重新確認`;
	err.isOperational = true;
};

// 錯誤處理
const handleError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'Error';
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

		if (err.code === 11000) {
			handleConfirmEmail(err);
			return resErrorProd(err, res);
		}

		if (err.name === 'SyntaxError') {
			handleSyntaxError(err);
			return resErrorProd(err, res);
		}

		if (err.name === 'JsonWebTokenError') {
			handleJWTError(err);
			return resErrorProd(err, res);
		}

		resErrorProd(err, res);
	}
};

module.exports = handleError;
