const appError = require('../config/appError');
const catchErrorAsync = require('../config/catchErrorAsync');
const sizeOf = require('image-size');
const upload = require('../config/image');
const successHandle = require('../config/handleResponse');
const { ImgurClient } = require('imgur');

exports.uploadImage = catchErrorAsync(async (req, res, next) => {
	if (!req.files.length) {
		return appError(400, '尚未上傳檔案', next);
	}
	const dimensions = sizeOf(req.files[0].buffer);
	if (dimensions.width !== dimensions.height) {
		return appError(400, '圖片長寬不符合 1:1 尺寸', next);
	}
	const client = new ImgurClient({
		clientId: process.env.IMGUR_CLIENTID,
		clientSecret: process.env.IMGUR_CLIENT_SECRET,
		refreshToken: process.env.IMGUR_REFRESH_TOKEN
	});

	const response = await client.upload({
		image: req.files[0].buffer.toString('base64'),
		type: 'base64',
		album: process.env.IMGUR_ALBUM_ID
	});
	const imgUrl = response.data.link;
	successHandle(imgUrl, 200, res);
});
