const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66aa07b152185bfeb4021b12',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dvko2wkub/image/upload/v1724173343/Yelp-Camp/iiadfmp3sqgssq9bduxb.jpg',
                    filename: 'Yelp-Camp/iiadfmp3sqgssq9bduxb'
                },
                {
                    url: 'https://res.cloudinary.com/dvko2wkub/image/upload/v1724173342/Yelp-Camp/ly1mdryyhvqhceya7sxe.jpg',
                    filename: 'Yelp-Camp/ly1mdryyhvqhceya7sxe'
                }
                ]

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})