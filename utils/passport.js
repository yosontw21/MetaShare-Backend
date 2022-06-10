const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');

const User = require('../models/userModel');

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'https://warm-sea-66745.herokuapp.com/api/users/google/callback'
		},
		async (accessToken, refreshToken, profile, cb) => {
			console.log(profile)
			const user = await User.findOne({ googleId: profile.id });
			if (user) {
				console.log('使用者已存在');
				return cb(null, user);
			}

			const password = crypto.randomBytes(30).toString('hex');

			const newUser = await User.create({
				email: profile.emails[0].value,
				name: profile.displayName,
				password,
				googleId: profile.id
			});
			return cb(null, newUser);
		}
	)
);
