const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routers
const postRouter = require('./routes/postRouter');
app.use('/api/posts', postRouter);

module.exports = app;
