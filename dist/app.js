"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express = __importStar(require("express"));
const bodyParser = __importStar(require("body-parser"));
const nodemailer = __importStar(require("nodemailer"));
const app = express.default();
const router = express.Router();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.MAIL_USER}@gmail.com`,
        pass: process.env.MAIL_PASS
    }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
router.get('/', (req, res) => {
    res.send('Hello!');
});
router.post('/', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const message = req.body.message;
    console.log(email, name, message);
    if (email && name && message) {
        const mailOptions = {
            from: `${process.env.MAIL_USER}@gmail.com`,
            to: `${process.env.MAIL_ME}@gmail.com`,
            subject: 'Portfolio message',
            html: `<div><h2>${name}</h2><h4>${email}</h4><p>${message}</p></div>` // plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            console.log(info);
            if (err)
                res.send({ error: 'Mail was not sent.' });
            //@ts-ignore
            else
                res.redirect(req.headers.origin);
        });
    }
    else {
        res.send({ error: 'Invalid email/name/message parameters.' });
    }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
