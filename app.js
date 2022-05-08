const express = require('express');
const app = express();
const handleError = require('./config/handleError');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output.json')

const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routers
const postRouter = require('./routes/postRouter');

app.use('/api/posts', postRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

// Error 錯誤回傳訊息
app.use((req, res, next) => {

	res.status(404).json({
		status: 'Error',
		message: '找不到網頁 404 Not Found，請重新確認'
	});
});

// Error 錯誤回傳訊息
app.use(handleError)

module.exports = app;
