const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listings = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing, isHost } = require("../middleware.js");
const multer =require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({ storage});

const listingController = require("../controllers/listings.js");
//index route
router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn, isHost, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));
//render route
router.get("/new", isLoggedIn, isHost, listingController.renderNewForm);
//show route
router.route("/:id").get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isHost, isOwner, validateListing, upload.single("listing[image]"), wrapAsync(listingController.updateListings))
.delete(isLoggedIn, isHost, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, isHost, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;