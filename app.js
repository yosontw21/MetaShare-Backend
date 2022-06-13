const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const handleError = require('./utils/handleError');

const morgan = require('morgan');
const cors = require('cors');

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
	message: '此 IP 太多次請求，請於一小時後再試一次'
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api', limiter);

// Routers
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const uploadRouter = require('./routes/uploadRouter');

app.use('/api', postRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);

// utils
// const thirdPartyRouter =  require('./utils/thirdPartyLogin')
// app.use('/api/auth',thirdPartyRouter)


app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Error 錯誤回傳訊息
app.use((req, res, next) => {
	res.status(404).json({
		status: 'Error',
		message: '找不到網頁 404 Not Found，請重新確認'
	});
});

// Error 錯誤回傳訊息
app.use(handleError);

module.exports = app;
