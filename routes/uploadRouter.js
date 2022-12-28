const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authController = require('../controllers/authController');
const checkUpload = require('../utils/image.js');

router.route('/').post(
	authController.isAuth,
	checkUpload,
	/** 
			* #swagger.tags = ['會員功能']
			* #swagger.summary = '上傳圖片 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters['parameters_name'] = {
				in: 'formData',
				type: 'file',
				description: '上傳圖片',
			}
		*/

	/**
		 	#swagger.responses[200] = {
				description: '上傳圖片成功',
				schema: {
					status: "success",
					message: "https://i.imgur.com/example.png"
				}
			}
			#swagger.responses[400] = {
				description: '無法追蹤自己',
				schema: { $ref: "#/definitions/error_uploadImage_Schema" }
			}
		*/

	uploadController.uploadImage
);

module.exports = router;
