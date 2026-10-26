const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing =require("../models/listings.js");
const User = require("../models/user.js");

const MONGO_URL=process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust"
main().
then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
 console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB =async()=>{
    // Delete existing listings and users
    await Listing.deleteMany({});
    await User.deleteMany({});
    
    // Create a demo user
    const demoUser = new User({
        email: "demo@example.com",
        username: "demouser",
        role: "host"
    });
    
    const registeredUser = await User.register(demoUser, "demopassword");
    
    // Add listings with the demo user as owner
    initData.data= initData.data.map((obj)=>({
        ...obj,
        owner: registeredUser._id,
    }));
    
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();