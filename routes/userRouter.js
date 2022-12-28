const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post(
	'/check',
	authController.isAuth,
	/**
		* #swagger.tags = ['會員管理驗證']
		* #swagger.summary = '驗證是否登入 API'
		* #swagger.security = [{ "JSON Web Token": [] }]
		*/

	/**
		#swagger.responses[401] = {
      description: '未登入狀態',
			schema: { $ref: "#/definitions/error_noLoggin_Schema" }
    }
   */

	authController.check
);

router.post(
	'/signup',
	/** 
		* #swagger.tags = ['會員管理驗證']
		* #swagger.summary = '註冊帳號 API'

			#swagger.parameters['parameters_name'] = {
				in: 'body',
				description: '註冊帳號的格式',
				schema: {
				  name: "user01",
    			email: "example01@sample.com",
    			password: "a12345678",
    			passwordConfirm: "a12345678"
			}
		}
	*/

	/**
		#swagger.responses[201] = {
      description: '註冊成功',
			schema: { $ref: "#/definitions/userStatus_Schema"}
    }
		#swagger.responses[400] = {
      description: '操作錯誤會出現其中一個訊息',
			schema: { $ref: "#/definitions/error_signUp_Scheam" }
    }
   */
	authController.signup
);

router.post(
	'/login',
	/** 
		* #swagger.tags = ['會員管理驗證']
		* #swagger.summary = '登入帳號 API'

			#swagger.parameters['parameters_name'] = {
				in: 'body',
				description: '登入帳號的格式',
				schema: {
    			email: "example01@sample.com",
    			password: "a12345678",
			}
		}
	*/

	/**
	 		#swagger.responses[200] = {
				description: '登入成功',
				schema: {  $ref: "#/definitions/userStatus_Schema" }
    }
			#swagger.responses[400] = {
				description: '操作錯誤會出現其中一個訊息',
				schema: { $ref: "#/definitions/error_login_Schema" }
			}
	 */

	authController.login
);
router.get(
	'/logout',
	/** 
		* #swagger.tags = ['會員管理驗證']
		* #swagger.summary = '登出帳號 API'
	*/

	/**
	 		#swagger.responses[200] = {
				description: '登出成功',
				schema: {      
					status: "success",
    			data: "" 
			}
    }
 	*/
	authController.logout
);
router.post(
	'/forgotPassword',
	/** 
		* #swagger.tags = ['會員管理驗證']
		* #swagger.summary = '忘記密碼 API'

			#swagger.parameters['parameters_name'] = {
				in: 'body',
				description: '忘記密碼 的格式',
				schema: {
    			email: "example01@sample.com",
			}
		}
	*/

	/**
	 		#swagger.responses[200] = {
				description: '成功寄出郵件，並寄驗證碼到此信箱',
				schema: {     
					status: "success",
    			data: "成功寄出郵件"
				}
    	}
			#swagger.responses[400] = {
				description: '沒有此 email 帳號',
				schema: { 
					status: "Error",
    			message: "沒有此 email 帳號"
				}
			}
	 */
	authController.forgotPassword
);

router.patch(
	'/resetPassword/:token',
	/** 
		* #swagger.tags = ['會員管理驗證']
		* #swagger.summary = '重置密碼 API '

			#swagger.parameters['parameters_name'] = {
				in: 'body',
				description: '忘記密碼 的格式',
				schema: {
    			"password": "a12345678",
    			"passwordConfirm": "a12345678"
			}
		}
	*/

	/**
	 		#swagger.responses[201] = {
				description: '重置密碼成功',
				schema: {  $ref: "#/definitions/userStatus_Schema" }
    	}
				#swagger.responses[400] = {
				description: '無效的連結',
				schema: { 
					status: "Error",
					message: "無效的連結"
				}
			}
	 */
	authController.resetPassword
);
router.patch(
	'/updatePassword',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員管理驗證']
			* #swagger.summary = '更新密碼 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters['parameters_name'] = {
					in: 'body',
					description: '更新密碼的格式',
					schema: {
						  passwordCurrent: "a12345678",
							password: "test1234",
							passwordConfirm: "test1234"
					}
				}
		*/
	/**
		 	#swagger.responses[201] = {
				description: '更新密碼成功',
				schema: { $ref: "#/definitions/userStatus_Schema" }
			}
				#swagger.responses[400] = {
				description: '操作錯誤會出現其中一個訊息',
				schema: { $ref: "#/definitions/error_updatePassword_Schema" }
    	}
		 */
	authController.updatePassword
);

router.patch(
	'/myProfile',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員功能']
			* #swagger.summary = '修改個人資料 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters['parameters_name'] = {
					in: 'body',
					description: '修改個人頁面的格式',
					schema: {
		    			avatar: "https://i.imgur.com/AngqqaD.jpg",
  					  name: "柚子",
   						personalInfo: "安安安"
					}
				}
		*/
	/**
		 	#swagger.responses[200] = {
				description: '修改個人資料成功',
				schema: {     
					status: "success",
    			data: {
						_id: "62ee6d4fdb480a3990f5d3ee",
						name: "柚子",
						avatar: "https://i.imgur.com/AngqqaD.jpg",
						role: "user",
						personalInfo: "安安安"
    		} 
			}
		}
				#swagger.responses[400] = {
				description: '名字不可為空',
				schema: { 
					  status: "Error",
   				  message: "名字不可為空"
				 }
    	}
		 */
	userController.updateProfile
);

router.get(
	'/myProfile',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員功能']
			* #swagger.summary = '取得個人資料 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
	/**
		 	#swagger.responses[200] = {
				description: '取得個人資料成功',
				schema: { $ref: "#/definitions/profileStatus_Schema" }
			}
	*/
	userController.getMyProfile
);

router.get(
	'/otherProfile/:id',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員功能']
			* #swagger.summary = '其他使用者個人頁面 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

			#swagger.parameters[''] = {
				in: 'path',
				name: 'id',
				description: '輸入 User id',
    }
	*/

	/**
			#swagger.responses[200] = {
				description: '取得其他使用者個人頁面成功',
				schema: { $ref: "#/definitions/getUserPosts_Schema" }
			}
			#swagger.responses[400] = {
				description: '找不到 ID',
				schema: {		
					status: 'Error',
					message: '找不到 id，請重新確認' }
    	}
			#swagger.responses[500] = {
				description: '無效的 ID',
				schema: { $ref: "#/definitions/error_postId_Schema" }
    	}
	 */
	userController.getOtherProfile
);

router
	.route('/:id/following')
	.post(
		authController.isAuth,
		/** 
			* #swagger.tags = ['會員按讚追蹤動態']
			* #swagger.summary = '追蹤朋友 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
		/**
		 	#swagger.responses[200] = {
				description: '追蹤朋友成功',
				schema: {
					status: "success",
					message: "您已成功追蹤"
				}
			}
			#swagger.responses[400] = {
				description: '無法追蹤自己',
				schema: {
					status: "Error",
					message: "您無法追蹤自己"
				}
			}
		*/

		userController.addFollow
	)
	.delete(
		authController.isAuth,
		/** 
			* #swagger.tags = ['會員按讚追蹤動態']
			* #swagger.summary = '取消追蹤朋友 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
		/**
		 	#swagger.responses[200] = {
				description: '取消追蹤朋友',
				schema: {
					status: "success",
					message: "您已取消追蹤朋友"
				}				 
			}
		*/

		userController.delFollow
	);

router.delete(
	'/:id/followers',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員按讚追蹤動態']
			* #swagger.summary = '取消粉絲關注 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
	/**
		 	#swagger.responses[200] = {
				description: '取消粉絲關注',
				schema: { 
					status: "success",
					message: "您已取消粉絲關注" 
				}
			}
	*/

	userController.delFollowers
);

router.get('/getLikesList', authController.isAuth,
	/** 
			* #swagger.tags = ['會員按讚追蹤動態']
			* #swagger.summary = '取得個人按讚列表 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
	/**
		 	#swagger.responses[200] = {
				description: '取得個人按讚列表成功',
				schema: { $ref: "#/definitions/likesListStatus_Schema" }
			}
	*/

userController.getLikesList);

router.get(
	'/getFollowingList',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員按讚追蹤動態']
			* #swagger.summary = '取得個人追蹤名單 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
	/**
		 	#swagger.responses[200] = {
				description: '取得個人追蹤名單成功',
				schema: { $ref: "#/definitions/followingStatus_Schema" }
			}
	*/
	userController.getFollowingList
);

router.get(
	'/getFollowersList',
	authController.isAuth,
	/** 
			* #swagger.tags = ['會員按讚追蹤動態']
			* #swagger.summary = '取得個人粉絲名單 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

		*/
	/**
		 	#swagger.responses[200] = {
				description: '取得個人粉絲名單成功',
				schema: { $ref: "#/definitions/followersStatus_Schema" }
			}
	*/
	userController.getFollowersList
);

// router.get('/', authController.isAuth, userController.getUsers);

module.exports = router;
