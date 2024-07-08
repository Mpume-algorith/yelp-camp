const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reviewSchema = Schema({

    description: String,
    rating: Number
})

module.exports = module.exports = mongoose.model('Review', reviewSchema);