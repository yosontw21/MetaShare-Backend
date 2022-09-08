const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		service: 'SendGrid',
		host: process.env.EMAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.EMAIL_ACCOUNT,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const mailOptions = {
		from: `MetaWall 社交圈<${process.env.SEND_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
		html: options.html
	};

	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
