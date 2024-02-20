const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your SMTP server here
    auth: {
        user: 'yourEmail@gmail.com', // Your email
        pass: 'yourPassword' // Your email password
    }
});

app.post('/send-email', (req, res) => {
    const { subject, message } = req.body;

    const mailOptions = {
        from: 'yourEmail@gmail.com', // Sender address
        to: 'colemanstone108@gmail.com', // Your email address as recipient
        subject: subject, // Subject line
        text: message, // Plain text body
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err);
            res.send({status: 'fail', message: 'Email not sent'});
        } else {
            console.log(info);
            res.send({status: 'success', message: 'Email sent'});
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
