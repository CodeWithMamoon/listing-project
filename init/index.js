const mongoose = require("mongoose")
const Listing=require("../model/listing.js")
const initDBdata = require("./data.js")


const port = 3000;

const MONGO_URL = 'mongodb+srv://sap346044:mamoon123@cluster0.econ2zi.mongodb.net/?retryWrites=true'

main().then(()=>{
    console.log("connected DB")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initDBdata.data)
    console.log("data was init")
}
initDB();