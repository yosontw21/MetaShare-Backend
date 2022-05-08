const appError = (statusCode, message, next) => {
	const err = new Error(message);
	err.statusCode = statusCode;
	err.isOperational = true;
	next(err);
};

module.exports = appError;
