const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'Bible_Blog')));

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourEmail@gmail.com',
        pass: 'yourPassword',
    },
});

app.post('/send-email', (req, res) => {
    const { userEmail, subject, message } = req.body;

    const mailOptions = {
        from: 'yourEmail@gmail.com',
        to: 'recipient@example.com',
        replyTo: userEmail,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.error(err);
            res.status(500).send({ status: 'fail', message: 'Email not sent' });
        } else {
            console.log(info);
            res.send({ status: 'success', message: 'Email sent successfully' });
        }
    });
});

app.post('/add-entry', (req, res) => {
    const { newEntry } = req.body;
    const journalPath = path.join(__dirname, 'Bible_Blog', 'journal.html');

    fs.readFile(journalPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading journal file');
        }

        const updatedData = data.replace('</main>', `${newEntry}</main>`);

        fs.writeFile(journalPath, updatedData, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing to journal file');
            }

            res.send('Entry added successfully');
        });
    });
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bear108Bear*',
    database: 'users'
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
});

app.get('/test-connection', (req, res) => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            res.json({ success: false, message: 'Database connection failed' });
        } else {
            res.json({ success: true, message: 'Database connection successful' });
        }
    });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
