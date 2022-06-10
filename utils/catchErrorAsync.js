const catchErrorAsync = (func) => {
	// func 先將 async fun 帶入參數儲存
	// middleware 先接住 router 資料
	return (req, res, next) => {
		//再執行函式，並增加 catch 條件去捕捉
		// async 本身就是 promise，所以可用 catch 去捕捉
		func(req, res, next).catch((err) => {
			return next(err);
		});
	};
};

module.exports = catchErrorAsync;
