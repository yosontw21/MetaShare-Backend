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
			callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/google/callback`
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
			httpOnly: false
		};
		if (process.env.NODE_ENV === 'production') cookieOptions.secure = false;
		res.cookie('jwt', token, cookieOptions);
		res.redirect(
			302,
			`${process.env.CLIENT_BASE_URL}/MetaShare/#/post?token=${token}`
		);
	}
);

module.exports = router;
