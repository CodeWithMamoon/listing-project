const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./model/listing.js")
const path = require("path")
const merthodeoverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsyns = require("./utils/wrapAsyns.js")
const ExpressError = require("./utils/ExpressError.js")
const port = 3000;

const MONGO_URL = 'mongodb+srv://sap346044:mamoon123@cluster0.econ2zi.mongodb.net/?retryWrites=true'

main().then(() => {
    console.log("connected DB")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use(express.urlencoded({ extended: true }))
app.use(merthodeoverride("_method"))
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send("Hi its me")
})
// Show All Data
app.get("/listing", async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/show", { listings });
});

//show new Form
app.get("/listing/new", (req, res) => {
    res.render("listings/new");
});

// //create New
app.post("/listing", wrapAsyns ( async (req, res, next) => {
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listing");

}));

// finding same Id Data in Detail
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let GetData = await Listing.findById(id);
    res.render("listings/detail", { GetData });
})
//update By Id
app.get('/listing/:id/edit', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing })
})

//Update New
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listing");
});

//Delete listing By id
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id, { ...req.body.GetData });
    res.redirect("/listing");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="somthing went wrong"}=err;
    res.render('error.ejs',{message})
})
app.listen(port, () => {
    console.log(`listning on port ${port}`)
})