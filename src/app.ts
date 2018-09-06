import * as dotenv from 'dotenv';
import * as url from 'url';
dotenv.config();
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as nodemailer from 'nodemailer';
const app: express.Application = express.default();
const router: express.Router = express.Router();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const transporter: nodemailer.Transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: `${process.env.MAIL_USER}@gmail.com`,
		pass: process.env.MAIL_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

router.get('/', (req: express.Request, res: express.Response) => {
	res.send('Hello!');
});
router.post('/', (req: express.Request, res: express.Response) => {
	const email: string = req.body.email;
	const name: string = req.body.name;
	const message: string = req.body.message;
	console.log(email, name, message);

	if (email && name && message) {
		const mailOptions: nodemailer.SendMailOptions = {
			from: `${process.env.MAIL_USER}@gmail.com`, // sender address
			to: `${process.env.MAIL_ME}@gmail.com`, // list of receivers
			subject: 'Portfolio message', // Subject line
			html: `<div><h2>${name}</h2><h4>${email}</h4><p>${message}</p></div>` // plain text body
		};
		transporter.sendMail(mailOptions, function(err, info) {
			console.log(info);
			console.log(err);
			if (err) res.send({ error: 'Mail was not sent.' });
			//@ts-ignore
			else res.send({ success: 'Mail was sent.' });
		});
	} else {
		res.send({ error: 'Invalid email/name/message parameters.' });
	}
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
