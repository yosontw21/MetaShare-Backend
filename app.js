const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();
app.use(helmet());
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 1000,
	message: '此 IP 太多次請求，請於一小時後再試一次'
});
const handleError = require('./utils/handleError');

app.use(express.json({ limit: '10kb' }));

app.use(morgan('dev'));

app.use('/api', limiter);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

app.use(
	cors({
		origin: 'https://warm-sea-66745.herokuapp.com',
		credentials: true
	})
);

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// Routers
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const uploadRouter = require('./routes/uploadRouter');

app.use('/api', postRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);

// utils
const thirdPartyRouter = require('./utils/thirdPartyLogin');
app.use('/api/auth', thirdPartyRouter);

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
