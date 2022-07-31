const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('index', { title: 'Express' });
});

router.get('/createOrder', (req, res) => {
	res.json();
});

module.exports = router;
