const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const {storeReturnTo} = require('../middleware');
const controller = require('../controllers/user')


router.get('/register', controller.registerForm);

router.post('/register', catchAsync(controller.createNewUser));

router.get('/login', controller.loginForm);

router.post('/login', storeReturnTo ,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controller.userLogin)

router.get('/logout', controller.userLogout); 

module.exports = router;