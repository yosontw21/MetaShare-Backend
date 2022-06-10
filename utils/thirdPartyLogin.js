const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { generateUrlJWT } = require('../controllers/authController');

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
			callbackURL:
				'https://warm-sea-66745.herokuapp.com/api/auth/google/callback'
		},
		async (accessToken, refreshToken, profile, cb) => {
			console.log(profile);
			const user = await User.findOne({ googleId: profile.id });
			if (user) {
				return cb(null, user);
			}

			const password = crypto.randomBytes(30).toString('hex');

			const newUser = await User.create({
				email: profile.emails[0].value,
				photo: profile.photos[0].value,
				name: profile.displayName,
				password,
				googleId: profile.id
			});

			const html = `
	      <h2>恭喜您，註冊成功</h2>
      	<p>親愛的用戶您好， ${profile.displayName} 歡迎來到 MetaWall 社交圈</p>
	      <p>很高興您加入我們，歡迎使用我們的服務</p>`;

			await sendEmail({
				email,
				subject: '註冊成功通知',
				html
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
		generateUrlJWT(req.user, res);
	}
);

module.exports = router;
