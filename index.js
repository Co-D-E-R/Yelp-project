const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const joi = require('joi');
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

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));


app.get('/',(req,res) =>{
    res.render('home');
})

app.get('/campgrounds',catchAsync(async (req,res) =>{
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index',{ campgrounds })
}))

app.get('/campgrounds/new',(req,res) =>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',catchAsync(async(req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Data',400);
    const campgroundSchema = joi.object({
        campground: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            image: joi.string().required(),
            location: joi.string().required(),
            description: joi.string().required()
        }).required()
    })
    const { error }= campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    console.log(result);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id',catchAsync(async(req,res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{ campground });
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{ campground });
}))

app.put('/campgrounds/:id', catchAsync(async(req,res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async(req,res) =>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

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