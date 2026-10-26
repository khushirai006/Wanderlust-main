const Listings = require("../models/listings");
const Reviews= require("../models/review");


module.exports.createReview=async (req, res) => {
    let listing = await Listings.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review Created");

    req.session.save(() => {
      res.redirect(`/listings/${listing._id}`);
    });
}

module.exports.destroyReview=async (req, res) => {
        let { id, reviewId } = req.params;

        await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success", "review Deleted");
        req.session.save(() => {
          res.redirect(`/listings/${id}`);
        });
}