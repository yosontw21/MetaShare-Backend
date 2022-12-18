const swaggerAutogen = require('swagger-autogen')();

const dos = {
	info: {
		title: 'MetaShare API',
		description: 'MetaShare 相關 API'
	},
	host: 'localhost:3000',
	schemes: ['http', 'https'],
	securityDefinitions: {
		'JSON Web Token': {
			type: 'apiKey',
			schema: 'bearer',
			bearerFormat: 'JWT',
			in: 'headers',
			name: 'authorization',
			description: 'Bearer token'
		}
	},

	// response messages
	definitions: {
		error_signUp_Scheam: {
			emailStatus: {
				status: 'Error',
				message: 'Email 格式不正確'
			},
			repeatEmailStatus: {
				status: 'Error',
				message: 'Email 已有人使用，請重新註冊'
			},
			typeStatus: {
				status: 'Error',
				message: '資料格式錯誤，請重新確認'
			},
			validatorPasswordStatus: {
				status: 'Error',
				message: '密碼不一致，請重新確認'
			},
			passwordStatus: {
				status: 'Error',
				message: '密碼不能低於 8 碼，並中英混合'
			},
			colStatus: {
				status: 'Error',
				message: '欄位未填寫正確'
			}
		},
		error_updatePassword_Schema: {
			currentPassword: {
				status: 'Error',
				message: '當前的密碼不正確'
			},
			typeStatus: {
				status: 'Error',
				message: '資料格式錯誤，請重新確認'
			},
			validatorPasswordStatus: {
				status: 'Error',
				message: '密碼不一致，請重新確認'
			},
			passwordStatus: {
				status: 'Error',
				message: '密碼不能低於 8 碼，並中英混合'
			}
		},
		error_login_Schema: {
			emailStatus: {
				status: 'Error',
				message: 'Email 格式不正確'
			},
			userIncorrect: {
				status: 'Error',
				message: '您的帳號或密碼不正確'
			},
			typeStatus: {
				status: 'Error',
				message: '資料格式錯誤，請重新確認'
			},
			colStatus: {
				status: 'Error',
				message: '欄位未填寫正確'
			}
		},
		error_noLoggin_Schema: {
			status: 'Error',
			message: '您尚未登入'
		},
		error_postId_Schema: {
			status: 'Error',
			message: '無效的 ID，請重新確認'
		},
		error_post_Schema: {
			status: 'Error',
			message: '無法找到此貼文，請重新確認'
		},
		error_deletePost_Schema: {
			idStatus: {
				status: 'Error',
				message: '找不到 id，請重新確認'
			},
			delStatus: {
				status: 'Error',
				message: '你無法刪除無他使用者貼文'
			}
		},
		error_updatePost_Schema: {
			contentStatus: {
				status: 'Error',
				message: 'Content 未填寫'
			},
			editStatus: {
				status: 'Error',
				message: '你無法編輯無他使用者貼文'
			},
			typeStatus: {
				status: 'Error',
				message: '資料格式錯誤，請重新確認'
			},
			idStatus: {
				status: 'Error',
				message: '找不到 id，請重新確認'
			}
		},
		error_createPost_Schema: {
			contentStatus: {
				status: 'Error',
				message: 'Content 未填寫'
			},
			userTypeStatus: {
				status: 'Error',
				message: '使用者 格式錯誤'
			},
			userStatus: {
				status: 'Error',
				message: '無法找到使用者，請重新確認'
			}
		},
		getAllPosts_Schema: {
			status: true,
			data: [
				{
					_id: '63866de7430a8841e0be9744',
					user: {
						_id: '63866d0c430a8841e0be9676',
						name: 'Test',
						avatar: 'https://i.imgur.com/erdqB0d.jpg',
						role: 'user',
						personalInfo: '測試'
					},
					content: '嘿嘿',
					image: '',
					likes: [
						{
							_id: '63866d0c430a8841e0be9676',
							name: 'Test',
							avatar: 'https://i.imgur.com/erdqB0d.jpg',
							role: 'user'
						}
					],
					createdAt: '2022-11-29T20:39:03.174Z',
					comments: [
						{
							_id: '638c480733ecc5b9b42c3715',
							comment: '嘿',
							userId: {
								_id: '62ed1e72671067b1754e77cd',
								name: '小宥',
								avatar: 'https://i.imgur.com/Ls0oWis.jpg',
								role: 'user',
								personalInfo: '終於成功!!!!',
								passwordResetExpires: '2022-09-29T22:58:14.425Z'
							},
							postId: '63866de7430a8841e0be9744',
							createdAt: '2022-12-04T07:11:03.819Z'
						}
					],
					id: '63866de7430a8841e0be9744'
				}
			]
		},
		createPost_Schema: {
			status: 'success',
			data: {
				user: '62ee6d4fdb480a3990f5d3ee',
				content: '想睡覺',
				image: '',
				likes: [],
				_id: '63993f9282069f3f28815d92',
				createdAt: '2022-12-14T03:14:26.490Z',
				id: '63993f9282069f3f28815d92'
			}
		},
		post_Schema: {
			status: 'success',
			data: {
				_id: '63817bbfa009eb43df8c941b',
				user: {
					_id: '62ee6d4fdb480a3990f5d3ee',
					name: '柚子',
					avatar: 'https://i.imgur.com/ImgTFX5.jpg',
					role: 'user',
					personalInfo: '我是一個人'
				},
				content: '你好',
				image: 'https://i.imgur.com/ORZG2h7.jpg',
				likes: [],
				createdAt: '2022-11-26T02:36:47.645Z',
				id: '63817bbfa009eb43df8c941b'
			}
		},
		getUserPosts_Schema: {
			status: 'success',
			data: [
				{
					_id: '63993f9282069f3f28815d92',
					user: {
						_id: '62ee6d4fdb480a3990f5d3ee',
						name: '柚子',
						avatar: 'https://i.imgur.com/ImgTFX5.jpg',
						role: 'user',
						personalInfo: '我是一個人'
					},
					content: '想睡覺',
					image: '',
					likes: [],
					createdAt: '2022-12-14T03:14:26.490Z',
					comments: [],
					id: '63993f9282069f3f28815d92'
				},
				{
					_id: '631da009bd6df1b067ef49c8',
					user: {
						_id: '62ee6d4fdb480a3990f5d3ee',
						name: '柚子',
						avatar: 'https://i.imgur.com/ImgTFX5.jpg',
						role: 'user',
						personalInfo: '我是一個人'
					},
					content: '哈哈哈哈',
					image: 'https://i.imgur.com/5ypEbMc.jpg',
					likes: [
						{
							_id: '62ee6d4fdb480a3990f5d3ee',
							name: '柚子',
							avatar: 'https://i.imgur.com/ImgTFX5.jpg',
							role: 'user'
						}
					],
					createdAt: '2022-09-11T08:44:57.588Z',
					comments: [],
					id: '631da009bd6df1b067ef49c8'
				},
				{
					_id: '631c0fc16bf068ee763951c9',
					user: {
						_id: '62ee6d4fdb480a3990f5d3ee',
						name: '柚子',
						avatar: 'https://i.imgur.com/ImgTFX5.jpg',
						role: 'user',
						personalInfo: '我是一個人'
					},
					content: '哈哈哈哈哈哈哈哈哈哈哈哈',
					image: '',
					likes: [],
					createdAt: '2022-09-10T04:17:05.036Z',
					comments: [
						{
							_id: '631c123bd01e3324b68cd4b2',
							comment: '0 0 ',
							userId: {
								_id: '62ee6d4fdb480a3990f5d3ee',
								name: '柚子',
								avatar: 'https://i.imgur.com/ImgTFX5.jpg',
								role: 'user',
								personalInfo: '我是一個人'
							},
							postId: '631c0fc16bf068ee763951c9',
							createdAt: '2022-09-10T04:27:39.034Z'
						}
					],
					id: '631c0fc16bf068ee763951c9'
				}
			]
		},
		commentPost_Schema: {
			status: 'success',
			data: {
				_id: '639a911fda4373b7ac2a4d37',
				comment: '你好',
				userId: {
					_id: '62ee6d4fdb480a3990f5d3ee',
					name: '柚子',
					avatar: 'https://i.imgur.com/ImgTFX5.jpg',
					role: 'user',
					personalInfo: '我是一個人'
				},
				postId: '63993f9282069f3f28815d92',
				createdAt: '2022-12-15T03:14:39.770Z'
			}
		},
		postLike_Schema: {
			status: 'success',
			postId: '63993f9282069f3f28815d92',
			userId: '62ee6d4fdb480a3990f5d3ee'
		},
		userStatus_Schema: {
			status: 'success',
			data: {
				expires: '2022-12-22T03:14:13.692Z',
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU2ZDRmZGI0ODBhMzk5MGY1ZDNlZSIsIm5hbWUiOiLmn5rlrZAiLCJpYXQiOjE2NzEwNzQwNTMsImV4cCI6MTY3MTY3ODg1M30.x-jTNVMOROAuHe-GyXDgPoTuIJWrEIZGTyILPvy2VA4',
				name: 'user01',
				avatar: 'https://i.imgur.com/ImgTFX5.jpg'
			}
		},
		profileStatus_Schema: {
			status: 'success',
			data: {
				_id: '62ee6d4fdb480a3990f5d3ee',
				name: '柚子',
				avatar: 'https://i.imgur.com/AngqqaD.jpg',
				role: 'user',
				followers: [],
				following: [
					{
						user: {
							_id: '62ee6c9adb480a3990f5d3ea',
							name: '個性',
							avatar: 'https://i.imgur.com/uCs714u.jpg',
							role: 'user',
							personalInfo: '我只想睡覺123213'
						},
						createdAt: '2022-09-10T11:09:34.701Z'
					}
				],
				personalInfo: '安安安'
			}
		},
		followingStatus_Schema: {
			status: 'success',
			data: {
				_id: '62ee6c9adb480a3990f5d3ea',
				name: '柚123子',
				avatar: 'https://i.imgur.com/AngqqaD.jpg',
				role: 'user',
				following: [
					{
						user: {
							_id: '62ee6d4fdb480a3990f5d3ee',
							name: '柚子',
							avatar: 'https://i.imgur.com/AngqqaD.jpg',
							role: 'user',
							personalInfo: '安安安'
						},
						createdAt: '2022-09-10T18:28:15.259Z'
					}
				],
				personalInfo: '安安安'
			}
		},
		followersStatus_Schema: {
			status: 'success',
			data: {
				_id: '62ee6c9adb480a3990f5d3ea',
				name: '柚123子',
				avatar: 'https://i.imgur.com/AngqqaD.jpg',
				role: 'user',
				followers: [
					{
						user: {
							_id: '6316af7fa47318ddbded1aba',
							name: '小貓',
							avatar: 'https://i.imgur.com/VKdzes7.jpg',
							role: 'user',
							personalInfo: '我是一隻貓'
						},
						createdAt: '2022-09-10T11:06:33.315Z'
					}
				],
				personalInfo: '安安安'
			}
		}
	}
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, dos);
