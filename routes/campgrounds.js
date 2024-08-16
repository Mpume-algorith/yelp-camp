const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const router = express.Router(); 
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campground = require('../models/campground');
//const 



router.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({}).populate('author');
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/campgrounds', isLoggedIn ,validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Campground created successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
     }).populate('author');
    if(!campground){
        req.flash('error', 'The are no campgrounds found')
        res.redirect('/campgrounds');
    }
    console.log(campground.reviews.author);
    //console.log(campground);
    res.render('campgrounds/show', { campground });
}));

router.get('/campgrounds/:id/edit', isLoggedIn, isAuthor ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

router.put('/campgrounds/:id', isLoggedIn, isAuthor ,validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', "Campground Edited Successfully!")
    //const success = req.flash('success');
    //console.log(success)
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/campgrounds/:id', isLoggedIn, isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;