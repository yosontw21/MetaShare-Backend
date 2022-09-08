const multer = require('multer');
const path = require('path');
const upload = multer({
	limits: {
		fieldSize: 2 * 1024 * 1024
	},
	fileFilter(req, file, cb) {
		const ext = path.extname(file.originalname).toLowerCase();
		if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
			cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式'));
		}
		cb(null, true);
	}
}).any();

// const checkUpload = handleErrorAsync(async (req, res, next) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return next(appError(400, err.message))
//     }
//     if (!req.file) {
//       return next(appError(400, '請選擇一張圖片上傳'))
//     }
//     if (req.file?.size > 1000000) {
//       return next(appError(400, '圖片檔案過大，僅限 1mb 以下檔案'))
//     }
//     next()
//   })
// })

module.exports = upload;
