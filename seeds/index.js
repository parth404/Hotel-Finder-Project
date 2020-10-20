const mongoose              = require('mongoose'),
      Campground            = require('../models/campground');

const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/campfinder-data', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("Connected to DB!!!");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)]
const seedDB = async() =>{
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random()* 1000);
        const camp = new Campground({
            //MY USER ID
            author: '5f8ba19697ba6b32b86bf69a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'A lovely place to camp and be one with nature, which still holds the nostalgia of the old world charm along with the most modern day facilities is situated here. In Moon Resort the mist held by the hills and the pines lowers itself to welcome the travellers. Its freshness brings alive the sensations forgotten and buried under the fast pace of life.',
            price: price,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random1000].long,
                    cities[random1000].lat
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dq5rr7omt/image/upload/v1603065584/CampFinder/nywori9cgwuur7fgxv5t.jpg',
                    filename: 'CampFinder/nywori9cgwuur7fgxv5t'
                  },
                  {
                    url: 'https://res.cloudinary.com/dq5rr7omt/image/upload/v1603142918/CampFinder/lt99y0oum5ixpitjlwev.jpg',
                    filename: 'CampFinder/phxl8ek3rcf5mnjup9sq'
                  }
            ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})