const Listings = require("../models/listings")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const searchQuery = req.query.search || "";
    let filter = {};
    
    if (searchQuery) {
        // Create a case-insensitive regex search across title, description, location, and country
        const regex = new RegExp(searchQuery, "i");
        filter = {
            $or: [
                { title: regex },
                { description: regex },
                { location: regex },
                { country: regex }
            ]
        };
    }
    
    const allListings = await Listings.find(filter);
    res.render("listings/index.ejs", { allListings, searchQuery });
};

module.exports.renderNewForm = async (req, res) => {
  let isFirstListing = false;
  if (req.user && req.user.role === "host") {
    const count = await Listings.countDocuments({ owner: req.user._id });
    if (count === 0) {
      isFirstListing = true;
    }
  }
  res.render("listings/new.ejs", { isFirstListing });
};

module.exports.showListing=async (req,res)=>{
  let {id}=req.params;
  const listing=await Listings.findById(id).
  populate({
    path:"reviews",
    populate:{
      path:"author",
    }
  }).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist"); 
    return res.redirect("/listings"); 
  }
  res.render("listings/show.ejs",{listing});
}
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listings(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  req.session.save(() => {
    res.redirect("/listings");
  });
};

module.exports.renderEditForm=async (req,res)=>{
 let {id}=req.params;
 const listing = await Listings.findById(id);
 if(!listing){
    req.flash("error","Listing you requested for does not exist"); 
    return req.session.save(() => res.redirect("/listings")); 
  }

  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
 res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListings=async (req,res)=>{ 
  let {id}=req.params;
 let listing=await Listings.findByIdAndUpdate(id,{...req.body.listing});
 if(typeof req.file !=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={ url, filename };
  await listing.save();
 }
 req.flash("success","Listings Updated");
 req.session.save(() => {
   res.redirect(`/listings/${id}`);
 });
}

module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
  let deletedListings= await Listings.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
  req.session.save(() => {
    res.redirect("/listings");
  });
  
}