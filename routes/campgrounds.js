const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const router = express.Router(); 
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campground = require('../models/campground');
const controller = require('../controllers/campground');
//const 



router.get('/campgrounds', catchAsync(controller.index));

router.get('/campgrounds/new', isLoggedIn, controller.newCampgroundForm);

router.post('/campgrounds', isLoggedIn ,validateCampground, catchAsync(controller.postNewCampground))

router.get('/campgrounds/:id', catchAsync(controller.showCampground));

router.get('/campgrounds/:id/edit', isLoggedIn, isAuthor ,catchAsync(controller.editCampgroundForm))

router.put('/campgrounds/:id', isLoggedIn, isAuthor ,validateCampground, catchAsync(controller.editCampground));

router.delete('/campgrounds/:id', isLoggedIn, isAuthor,catchAsync(controller.deleteCampground));

module.exports = router;