const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const router = express.Router(); 
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campground = require('../models/campground');
const controller = require('../controllers/campground');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
//const 



router.get('/campgrounds', catchAsync(controller.index));

router.get('/campgrounds/new', isLoggedIn, controller.newCampgroundForm);

router.post('/campgrounds', isLoggedIn, upload.array('image'), validateCampground, catchAsync(controller.postNewCampground))

/*router.post('/campgrounds', upload.array('image'), (req, res) => {
    console.log(`form submitted!!!`);
    console.log(req.body, req.files.map(x => ({url: x.path, filename: x.filename})));
    //req.flash('success', 'files uploaded!')
    res.send('IT WORKED!!!')
})*/

router.get('/campgrounds/:id', catchAsync(controller.showCampground));

router.get('/campgrounds/:id/edit', isLoggedIn, isAuthor ,catchAsync(controller.editCampgroundForm))

router.put('/campgrounds/:id', isLoggedIn, isAuthor, upload.array('image'),/*validateCampground,*/ catchAsync(controller.editCampground));

router.delete('/campgrounds/:id', isLoggedIn, isAuthor,catchAsync(controller.deleteCampground));

module.exports = router;