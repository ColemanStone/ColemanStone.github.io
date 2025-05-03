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
app.get('/my-info', (req, res) => res.render('my_information'));

// Custom event pages
app.get('/2025-reunion/boating', (req, res) => res.render('2025_morgan_reunion_boating'));
app.get('/2025-reunion/flower-picking', (req, res) => res.render('2025_morgan_reunion_flower_picking'));
app.get('/2025-reunion/golf', (req, res) => res.render('2025_morgan_reunion_golf'));

// Start server
app.listen(port, () => {
    console.log(`Site running at http://localhost:${port}`);
});