// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bear108Bear*',
    database: 'users'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (user_name, user_pass, registration_date) VALUES (?, ?, NOW())';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            res.json({ success: false, message: 'Registration failed' });
        } else {
            res.json({ success: true, message: 'Registration successful' });
        }
    });
});


fetch('/test-connection')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Database connection successful');
        } else {
            console.log('Database connection failed');
        }
    })
    .catch(error => console.error('Error:', error));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});