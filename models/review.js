const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reviewSchema = Schema({

    description: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = module.exports = mongoose.model('Review', reviewSchema);