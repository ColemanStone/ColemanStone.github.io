const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs')
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/site.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0
  )
`);

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
app.get('/faction_sim', (req, res) => {
    res.render('faction_sim');
});
app.get('/', (req, res) => res.render('index'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            return res.send('Invalid credentials');
        }
        if (await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            req.session.isAdmin = !!user.is_admin;
            res.redirect('/journal');
        } else {
            res.send('Invalid credentials');
        }
    });
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
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function (err) {
        if (err) {
            return res.send('Username already exists.');
        }
        res.redirect('/login');
    });
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