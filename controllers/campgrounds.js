const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Data',400);
    const campground = new Campground(req.body.campground);
    try {
        campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.author = req.user._id;
        await campground.save();
        console.log(campground);
        req.flash('success', 'Successfully Created a new campground');
        res.redirect(`/campgrounds/${campground._id}`)
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('campgrounds/new');
    }
}

module.exports.showCampgrounds = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash('error', 'Cannot find that campground !');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/campgrounds');

    }
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.images.push(...imgs);
        await campground.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }

            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        req.flash('success', 'Successfully Updated');
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        req.flash('error', e.message);
        res.redirect(`/campgrounds/${campground._id}`);

    }
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    try {
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully Deleted Campground');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect(`/campgrounds/${id}`);
    }
}