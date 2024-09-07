if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//console.log(process.env.SECRET);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const campgrounds = ('./routes/campgrounds')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy= require('passport-local');
const User = require('./models/user.js');
const userRoutes = require('./routes/users.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))
//flash middleware
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser()) 

//setting flash message middleware
app.use((req, res, next) =>{
    //console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.url = req.originalUrl;
    //console.log(req.files.map(x => ({url: x.path, filename: x.filename})));
    console.log(res.locals.url);
    //console.log(res.locals.currentUser);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

//Routes decoupling
app.use('/', userRoutes);
app.use('/', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)

//app.use(cookieParser()) 
//express session middleware

    
app.get('/', (req, res) => {
    res.render('home')
});
//app.get('/campgrounds/:id/reviews')

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})