const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
app.set("view engine","ejs");
app.set("ejsMate","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride("__method"))
app.use(express.urlencoded({extended:true}));
const Schema=mongoose.Schema

const dbUrl=process.env;
async function main(){
  return await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("..");
}).catch((err)=>{
    console.log(err);
})

const listingSchema=new Schema({
    title:{
        type:String,
        required,
    }
})
const Listings=new mongoose.model("listingSchema",listingSchema);
const newListing=new Listings({

})
await newListing.save();
module.exports=Listings
