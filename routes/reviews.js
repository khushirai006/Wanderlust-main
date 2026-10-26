const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Reviews = require("../models/review.js");
const Listings = require("../models/listings.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const review = require("../models/review.js");

const reviewController= require("../controllers/reviews.js");


router.delete("/:reviewId",
    isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
module.exports = router;