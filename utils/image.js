const multer = require('multer');
const path = require('path');
const catchErrorAsync = require('../utils/catchErrorAsync');
const appError = require('../utils/appError');

const upload = multer({
	// limits: {
	// 	fieldSize: 2 * 1024 * 1024
	// },
	fileFilter(req, file, cb) {
		const ext = path.extname(file.originalname).toLowerCase();
		if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
			return cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式'));
		}
		cb(null, true);
	}
}).any();

const checkUpload = catchErrorAsync(async (req, res, next) => {

	upload(req, res, async (err) => {
		if (err) {
			return appError(400, err.message, next);
		}
		if (!req.files[0]) {
			return appError(400, '請選擇一張圖片上傳', next);
		}
		if (req.files[0].size > 2000000) {
			return appError(400, '圖片檔案過大，僅限 2mb 以下檔案', next);
		}

		next();
	});
});

module.exports = checkUpload;
