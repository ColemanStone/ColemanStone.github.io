const fetch = require('node-fetch');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt')
const User = require('./models/User')
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) =>{
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/blog', (req, res) =>{
    res.render('blog')
})

app.get('/music', (req, res) =>{
    res.render('music')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        await User.create({ username, passwordHash });
        res.redirect('/login');
    } catch {
        res.send('Error registering user.');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

mongoose.connect('mongodb+srv://stonecoleman4563:3KhN5HqivM61tIP3@colemanstoneinfo.dk5dcgg.mongodb.net/?retryWrites=true&w=majority&appName=Colemanstoneinfo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MonoDB'))
    .catch(err => console.error('MonogoDB connection error:', err));

app.use(session({
    secret: 'afb985a2cc7f86d97ac698eab4aadc777e1a7e95833867a0c6d55a2f34a1d82640295114493098fd8010e24d27a0c2ea0d98754d694fb69171467d5db5fc9d4a',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({username});
    if (!user) return done(null, false, {message: 'User Not Found'});

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return done(null, false, {message: 'Incorrect Password'});

    return done(null, user);
}));

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
})

app.use(express.urlencoded({extended: false}))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));