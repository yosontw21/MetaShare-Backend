const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/userModel');

const dotenv = require('dotenv');
dotenv.config({
	path: './config.env'
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/api/auth/google/callback'
		},
		async (accessToken, refreshToken, profile, cb) => {
			// console.log(profile);
			const user = await User.findOne({ googleId: profile.id });
			if (user) {
				return cb(null, user);
			}

			// const email = await User.findOne({ email });
			// if (email) {
			// 	return cb(null, email);
			// }

			const password = crypto.randomBytes(30).toString('hex');

			const newUser = await User.create({
				email: profile.emails[0].value,
				avatar: profile.photos[0].value,
				name: profile.displayName,
				password,
				googleId: profile.id
			});
			return cb(null, newUser);
		}
	)
);

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['email', 'profile']
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', { session: false }),
	(req, res) => {
		const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_DAY
		});
		const cookieOptions = {
			expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 86400000),
			httpOnly: true
			// secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
		};
		res.cookie('jwt', token, cookieOptions);
		// res.redirect(
		// 	302,
		// 	`http://localhost:8080/index.html?token=${token}$name=${req.user.name}`
		// );
		res.send({
			status: 'success',
			name: req.user.name,
			avatar: req.user.avatar,
			token
		});
	}
);

// router.options(
// 	'/google/callback',
// 	passport.authenticate('google', { session: false }),
// 	(req, res) => {
// 		res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // 明確指定
// 		res.header('Access-Control-Allow-Credentials', true); // 新增這個
// 		res.header('Access-Control-Allow-Headers', 'content-type, X-App-Version');
// 		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// 		res.header(
// 			'Access-Control-Allow-Headers',
// 			'Origin, X-Requested-With, Content-Type, Accept'
// 		);
// 		res.end();
// 	}
// );

module.exports = router;
