const User = require('../models/user')


module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.createNewUser = async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email: email, username: username});
        const newUser = await User.register(user, password);
        req.login(newUser, (err)=>{
            if (err){
                return next(err); 
            }
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds');
        })
        
    } catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginForm = (req, res) =>{
    res.render('users/login');
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}