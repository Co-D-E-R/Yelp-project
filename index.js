const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
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

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')))


app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


app.get('/',(req,res) =>{
    res.render('home');
})



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next) =>{
    const { statusCode = 500} = err;
    if(!err.message) err.message= 'Oh No,Something Went Worng'
    res.status(statusCode).render('error',{ err });
})

app.listen(3000, () =>{
    console.log("Listening to port 3000!!");
})