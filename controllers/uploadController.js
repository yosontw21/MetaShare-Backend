const appError = require('../utils/appError');
const catchErrorAsync = require('../utils/catchErrorAsync');
const sizeOf = require('image-size');
const upload = require('../utils/image');
const successHandle = require('../utils/handleResponse');
const { ImgurClient } = require('imgur');

exports.uploadImage = catchErrorAsync(async (req, res, next) => {
	const { files, query: { type } } = req;

	if (!files) {
		return appError(400, '尚未上傳檔案', next);
	}
	const dimensions = sizeOf(req.files[0].buffer);

	if (type === 'avatar') {
		if (dimensions.width !== dimensions.height) {
			return appError(400, '圖片長寬不符合 1:1 尺寸', next);
		}
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
