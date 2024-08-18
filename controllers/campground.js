const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate('author');
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.postNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Campground created successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
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
    //console.log(campground.reviews.author);
    //console.log(campground);
    res.render('campgrounds/show', { campground });
}

module.exports.editCampgroundForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', "Campground Edited Successfully!")
    //const success = req.flash('success');
    //console.log(success)
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground =  async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully')
    res.redirect('/campgrounds');
}