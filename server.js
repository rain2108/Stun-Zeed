const express = require('express');
const app = express();
const {connectMongoose, User} = require('./database.js');
const pug = require('pug');
const passport = require('passport');
const { initializingPassport, isAuthenticated } = require('./passportConfig.js');
const expressSession = require('express-session')
app.use(express.static('public'));
connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(expressSession({
    secret:'secret',
    resave: false ,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "pug");




app.get('/home', (req, res) => {
    res.sendFile(__dirname+"/views/home.html");
})




app.get('/login', (req, res) => {
    res.sendFile(__dirname+"/views/userLogin.html");
})

app.get('/blog', (req, res) => {
    res.sendFile(__dirname+"/views/blog.html");
})

app.post('/register', async (req, res) => {
    console.log('ok')
    const user = await User.findOne({username: req.body.username });
    console.log('ok')

    if(user) return res.status(201).send("User already exists");

    const newUser = await User.create(req.body);

    res.status(201).redirect('/');
})

app.post('/login', passport.authenticate('local',{
    failureRedirect:'/register', 
    successRedirect:'/'}), 
);

app.get('/profile', isAuthenticated, (req, res) => {
    res.send(req.user);
})

app.get('/logout', (req, res) => {
    req.logout();
    res.send('logged out');
});

app.listen(4001, () => {
    console.log('listening on 4001');
});