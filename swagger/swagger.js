const swaggerAutogen = require('swagger-autogen')();

const dos = {
	info: {
		title: 'Meta API',
		description: '範例文件'
	},
	host: 'localhost:3000',
	schemes: ['http', 'https'],
	securityDefinitions: {
		apiKeyAuth: {
			type: 'apiKey',
			in: 'headers',
			name: 'authorization',
			description: '請加上 API Token'
		}
	}
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, dos);
