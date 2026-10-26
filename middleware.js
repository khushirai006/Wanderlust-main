const Listing=require("./models/listings");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    return req.session.save(() => res.redirect("/login"));
  }
  next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return req.session.save(() => res.redirect(`/listings/${id}`));
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
   next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return req.session.save(() => res.redirect(`/listings/${id}`));
    }
    next();
};

module.exports.isHost = (req, res, next) => {
  if (req.user && req.user.role !== "host") {
    req.flash("error", "Only hosts are allowed to perform this action.");
    return req.session.save(() => res.redirect("/listings"));
  }
  next();
};

module.exports.checkHostFirstListing = async (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === "host") {
    const listingCount = await Listing.countDocuments({ owner: req.user._id });
    if (listingCount === 0) {
      const pathOnly = req.originalUrl.split('?')[0];
      const isAllowed =
        (pathOnly === "/listings/new" && req.method === "GET") ||
        (pathOnly === "/listings" && req.method === "POST") ||
        (pathOnly === "/logout" && req.method === "GET");

      if (!isAllowed) {
        return res.redirect("/listings/new");
      }
    }
  }
  next();
};

