const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Static files (CSS/JS/Images)
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/project-home', (req, res) => res.render('project_home_page'));
app.get('/my_information', (req, res) => res.render('my_information'));
app.get('/journal', (req, res)=> res.render('journal'))
app.get('/blog', (req, res)=> res.render('blog'))

// Start server
app.listen(port, () => {
    console.log(`Site running at http://localhost:${port}`);
});