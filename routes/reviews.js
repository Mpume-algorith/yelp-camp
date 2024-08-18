const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, storeReturnTo, isReviewAuthor} = require('../middleware.js')
const controller = require('../controllers/review.js')


router.post('/', catchAsync(controller.postReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(controller.deleteReview))

module.exports = router;