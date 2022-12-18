const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

router.get(
	'/posts',
	authController.isAuth,
	/** 
		* #swagger.tags = ['動態貼文']
		* #swagger.summary = '取得所有貼文 API'
		* #swagger.security = [{ "JSON Web Token": [] }]
		

		#swagger.parameters['q'] = {
      in: 'query',
      description: '關鍵字',
      type: 'string',
    }
    #swagger.parameters['sort'] = {
      in: 'query',
      description: '排序方式，desc 為新至舊，asc 為舊至新',
      type: 'string',
    }
	*/

	/**
		#swagger.responses[200] = {
      description: '取得所有貼文成功',
			schema: { $ref: "#/definitions/getAllPosts_Schema" }
    }
		#swagger.responses[401] = {
      description: '未登入狀態',
			schema: { $ref: "#/definitions/error_noLoggin_Schema" }
    }
   */
	postController.getAllPosts
);

router.post(
	'/post',
	authController.isAuth,
	/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '新增貼文 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters['parameters_name'] = {
					in: 'body',
					description: '新增貼文輸入的格式',
					schema: {
						content: '你好',
						image: 'https://i.imgur.com/ORZG2h7.jpg',
					}
				}
			*/

	/**
			#swagger.responses[200] = {
				description: '新增貼文成功',
				schema: { $ref: "#/definitions/createPost_Schema" }
			}
			#swagger.responses[400] = {
				description: '操作錯誤會出現其中一個訊息',
				schema: { $ref: "#/definitions/error_createPost_Schema" }
			} 
		
		*/
	postController.createPost
);

router
	.route('/post/:id')
	.get(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '取得單筆貼文 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters[''] = {
					in: 'path',
					name: 'id',
					description: '輸入 Post id',
    	}		
		*/

		/**
		#swagger.responses[200] = {
      description: '取得貼文成功',
			schema: { $ref: "#/definitions/post_Schema" }
    }
		#swagger.responses[400] = {
      description: '找不到貼文資料',
			schema: {     
				status: "Error",
   			message: "找不到貼文資料，或是 id 不正確" 
			}
    }
		#swagger.responses[500] = {
      description: '無效的 ID',
			schema: { $ref: "#/definitions/error_postId_Schema" }
    }
		*/
		postController.getPost
	)
	.patch(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '編輯單筆貼文 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

			#swagger.parameters[''] = {
				in: 'path',
				name: 'id',
				description: '輸入 Post id',
    	}		
			#swagger.parameters['parameters_name'] = {
				in: 'body',
				description: '編輯貼文的格式',
				schema: {
					content: '你好',
					image: 'https://i.imgur.com/ORZG2h7.jpg',
      }
    }
		*/

		/**
		#swagger.responses[200] = {
      description: '編輯貼文成功',
			schema: { $ref: "#/definitions/post_Schema" }
    }
		#swagger.responses[400] = {
      description: '操作錯誤會出現其中一個訊息',
			schema: { $ref: "#/definitions/error_updatePost_Schema" }
    }
		#swagger.responses[500] = {
      description: '無效的 ID',
			schema: { $ref: "#/definitions/error_postId_Schema" }
    }
		*/
		postController.updatePost
	)
	.delete(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '刪除單筆貼文 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters[''] = {
					in: 'path',
					name: 'id',
					description: '輸入 Post id',
    		}		
		*/

		/**
			#swagger.responses[200] = {
				description: '刪除貼文成功',
				schema: { status: 'success' }
			}
			#swagger.responses[400] = {
				description: '操作錯誤會出現其中一個訊息',
				schema: { $ref: "#/definitions/error_deletePost_Schema" }
    	}
		 */
		postController.delPost
	);

router.get(
	'/posts/user/:id',
	authController.isAuth,
	/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '取得個人所有貼文 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

			#swagger.parameters[''] = {
				in: 'path',
				name: 'id',
				description: '輸入 User id',
    }
	*/

	/**
			#swagger.responses[200] = {
				description: '取得個人貼文成功',
				schema: { $ref: "#/definitions/getUserPosts_Schema" }
			}
			#swagger.response[500] = {
				description: '無效的 ID',
				schema: { $ref: "#/definitions/error_postId_Schema" }
    	}
	 */
	postController.getUserPosts
);

router
	.route('/post/:id/likes')
	.post(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '新增貼文讚 API'
			* #swagger.security = [{ "JSON Web Token": [] }]
			
			  #swagger.parameters[''] = {
			     in: 'path',
				   name: 'id',
				   description: '輸入 Post id',
    	}
		*/

		/**
		 	#swagger.responses[201] = {
				description: '按讚成功',
				schema: { $ref: "#/definitions/postLike_Schema" }
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
		postController.likesPost
	)
	.delete(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '取消增貼文讚 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

			  #swagger.parameters[''] = {
			    in: 'path',
				  name: 'id',
				  description: '輸入 Post id',
    	}
		*/
		/**
		 	#swagger.responses[200] = {
				description: '取消按讚成功',
				schema: { $ref: "#/definitions/postLike_Schema" }
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
		postController.delLikesPost
	);

router
	.route('/post/:id/comments')
	.post(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '新增貼文留言 API'
			* #swagger.security = [{ "JSON Web Token": [] }]

				#swagger.parameters[''] = {
					in: 'path',
					name: 'id',
					description: '輸入 Post id',
    	}

				#swagger.parameters['parameters_name'] = {
					in: 'body',
					description: '新增留言的格式',
					schema: {
						comment: '你好',
					}
				}
		*/
		/**
				#swagger.responses[201] = {
				description: '新增留言成功',
				schema: {  
				status: "success",
				data: {
					comments: {
					comment: "嘿嘿",
					userId: "62ee6d4fdb480a3990f5d3ee",
					postId: "63993f9282069f3f28815d92",
					_id: "639a85c14f4144f93c8b49fb",
					createdAt: "2022-12-15T02:26:09.634Z"
    		 }
  		}}

			}
				#swagger.responses[400] = {
				description: '無法找到此貼文',
				schema: { $ref: "#/definitions/error_post_Schema" }
			}
				#swagger.response[500] = {
				description: '無效的 ID',
				schema: { $ref: "#/definitions/error_postId_Schema" }
    	}
		 */
		postController.createPostComment
	)
	.patch(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '編輯貼文留言 API'
			* #swagger.security = [{ "JSON Web Token": [] }]
				#swagger.parameters[''] = {
					in: 'path',
					name: 'id',
					description: '輸入 Comment id',
    	}

				#swagger.parameters['parameters_name'] = {
					in: 'body',
					description: '編輯留言的格式',
					schema: {
						comment: '你好',
					}
				}
		*/
		/**
				#swagger.responses[200] = {
				description: '編輯留言成功',
				schema: { $ref: "#/definitions/commentPost_Schema" }
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
		postController.updatePostComment
	)
	.delete(
		authController.isAuth,
		/** 
			* #swagger.tags = ['動態貼文']
			* #swagger.summary = '刪除貼文留言 API'
			* #swagger.security = [{ "JSON Web Token": [] }]
			*	#swagger.parameters[''] = {
					in: 'path',
					name: 'id',
					description: '輸入 Comment id',
    	}
		*/
		/**
				#swagger.responses[200] = {
				description: '刪除留言成功',
				schema: { $ref: "#/definitions/commentPost_Schema" }
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
		postController.delPostComment
	);

module.exports = router;
