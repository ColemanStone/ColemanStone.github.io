const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs')
const bcrypt = require('bcrypt');
const db = require('./database');


// Static files (CSS/JS/Images)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(session({
    secret: 'yourSecretKeyHere', // Replace with a secure secret in production
    resave: false,
    saveUninitialized: false
}));

let journalEntries = [];

app.post('/journal/new', (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).send('Forbidden');
    }
    const { title, content } = req.body;
    journalEntries.push({ title, content });

    fs.writeFileSync('data/journal.json', JSON.stringify(journalEntries, null, 2));

    res.redirect('/journal');
});

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        req.session.isAdmin = !!user.is_admin;
        res.redirect('/journal');
    } else {
        res.send('Invalid credentials');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/journal');
    });
});
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);
        res.redirect('/login');
    } catch (err) {
        res.send('Username already exists.');
    }
});
app.get('/project_home_page', (req, res) => res.render('project_home_page'));
app.get('/my_information', (req, res) => res.render('my_information'));
app.get('/journal', (req, res) => {
    const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'journal.json')));
    res.render('journal', { journalEntries: entries, isAdmin: req.session.isAdmin, user: req.session.userId });
});
app.get('/blog', (req, res) => res.render('blog'))
app.get('/myTestimony', (req, res) => res.render('myTestimony'))
// Start server
app.listen(port, () => {
    console.log(`Site running at http://localhost:${port}`);
});