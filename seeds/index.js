const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yelp_camp');
    console.log("Database Connected");
//   use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = array => array[Math.floor(Math.random() * array.length)];


// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`
//         })
//         await camp.save();
//     }
// }

const seeddb = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author:'6509d1e648b964287c272c12',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio doloribus possimus tempore voluptatibus delectus voluptatem omnis amet fuga veniam quo libero eius aliquid iure, porro ratione, quam dolorem similique. Repellat?',
            price,
            images:[
                {
                  url: 'https://res.cloudinary.com/dnpmcbq9p/image/upload/v1695243608/YelpCamp/qwe3chyo9tnl8wty3ygj.jpg',
                  filename: 'YelpCamp/qwe3chyo9tnl8wty3ygj',     
                },
                {
                  url: 'https://res.cloudinary.com/dnpmcbq9p/image/upload/v1695243609/YelpCamp/bmvcw2jdkn80b2sr9pk5.jpg',
                  filename: 'YelpCamp/bmvcw2jdkn80b2sr9pk5',            
                }
              ]
        })
        await camp.save();

    }
}

seeddb().then(()=>{
    mongoose.connection.close();
});

