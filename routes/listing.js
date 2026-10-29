// const express = require("express");
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedIn } = require("../views/midlware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// ================= SIGNUP ROUTE =================
router.get("/signup", (req, res) => {
    res.render("users/signup");
});



router.get("/new",isLoggedIn,  (req, res) => {
   

    res.render("listings/new.ejs");
});


// ================= INDEX ROUTE =================
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}));


// ================= EDIT ROUTE =================
// IMPORTANT: this must come BEFORE /:id
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/edit", { listing });
}));


// ================= SHOW ROUTE =================
router.get("/:id", wrapAsync(async (req, res) => {

    console.log("LISTING ROUTE HIT:", req.params.id);

    let { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "listing does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
}));


// ================= CREATE ROUTE =================
router.post(
    "/", isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {

        const newListing = new Listing(req.body.listing);

        await newListing.save();

        req.flash("success", "New Listing Created!");

        res.redirect("/listings");
    })
);


// ================= UPDATE ROUTE =================
router.put(
    "/:id", isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing }
        );

        req.flash("success", "listing updated!");

        res.redirect("/listings");
    })
);


// ================= DELETE ROUTE =================
router.delete(
    "/:id", isLoggedIn,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        let deletedListing = await Listing.findByIdAndDelete(id);

        console.log(deletedListing);

        req.flash("success", "New deleted");

        res.redirect("/listings");
    })
);


module.exports = router;
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/reviews.js");

// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };
// //new route
// router.get("/new", (req, res) => {
//     res.render("listings/new");
// });
// //index route
// router.get("/",wrapAsync(async(req, res) => {
//     const allListings = await Listing.find();
//     res.render("listings/index", {allListings});
    
// }));


// //show route
// router.get("/:id", wrapAsync(async (req, res) => {
//     console.log("LISTING ROUTE HIT:", req.params.id);
// let {id} = req.params;
// const listing = await Listing.findById(id).populate("reviews");
// if(!listing){
//     req.flash("error", "listing does not exist");
//     res.redirect("/listings");
// }
// res.render("listings/show",{listing});
// }));





// //

// //Create Route
// router.post(
//     "/",
//     validateListing,
//     wrapAsync(async (req, res, next) => {
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         req.flash("success", "New Listing Created!");
//         res.redirect("/listings");
//     })
// );
// //edit route
// router.get("/:id/edit", wrapAsync(async (req, res) => {
// let {id } = req.params;
// const listing = await Listing.findById(id);
// res.render("listings/edit", { listing }); 
// }));

// //update route
// router.put("/:id",validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id,  {... req.body.listing});
//      req.flash("success", "listing updated!");
//    res.redirect("/listings");
// }));

// //dr\elete route
// router.delete("/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing =  await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//      req.flash("success", "New deleted");
//     res.redirect("/listings");

// }));

// module.exports = router;
