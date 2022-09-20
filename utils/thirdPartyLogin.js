const express = require('express');
const app = express();
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

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => {
			console.log('deserializeUser', user);
			done(null, user);
		})
		.catch((err) => done(err, null));
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
app.use(passport.initialize());
app.use(passport.session());

router.get('/google', (req, res, next) => {
	if (req.query.redirect) req.session.authRedirect = req.query.redirect;
	passport.authenticate('google', {
		scope: ['email', 'profile']
	})(req, res, next);
});

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
	const token = jwt.sign(
		{ id: req.session.passport.user },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_DAY
		}
	);
	req.session.jwt = token;
	console.log(	req.session)
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 86400000)
	};
	res.cookie('jwt', token, cookieOptions, {
		domain: `${process.env.CLIENT_BASE_URL}`
	});
	res.redirect(
		302,
		`${process.env.CLIENT_BASE_URL}/MetaShare/#/post?token=${token}`
	);
});

module.exports = router;
