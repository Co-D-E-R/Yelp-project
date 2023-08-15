const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

// mongoose.connect('mongodb://localhost:27017/yelp-camp',{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// });

// const db = mongoose.connection;
// db.on("error",console.error.bind(console,"connection error"));
// db.once("open", () =>{
//     console.log("Database Connected!!");
// });

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yelp_camp');
    console.log("Database Connected");
//   use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express();


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



app.get('/',(req,res) =>{
    res.render('home');
})

app.get('/makecampground',async (req,res) =>{
    const camp = new Campground({ title: 'My Backyard', description : 'Cheap camp ground'});
    await camp.save();
    res.send(camp);
})



app.listen(3000, () =>{
    console.log("Listening to port 3000!!");
})