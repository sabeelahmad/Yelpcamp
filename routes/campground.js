var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            // if no error, pass allCampgrounds which containts data of DB to our template file which displays all campgrounds on this route
            res.render("campground/index", {campgrounds:allCampgrounds});
        }
    });
});

// Post route on /campgrounds which will take post request data from a form and then redirect to get route on /campgrounds
// Create - Create a new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Get data
    var name = req.body.name;
    var image = req.body.img;
    var dsc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    var newCampground = {name : name, image : image, description : dsc, author: author, price: price};
    // Add this newlycreated campground to DB and save
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // Safely added, redirect
            res.redirect("/campgrounds");
        }
    });
   
});

// Route for form
// NEW - Submit a new campground using a form
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campground/new"); 
});


// ROUTE -> SHOW : Shows details about a particular campground
router.get("/:id", function(req, res) {
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
       if(err || !foundCampground) {
           req.flash("error", "Campground not found.");
           res.redirect("back");
       } else {
        //   Render show template and pass it the foundCampground
            res.render("campground/show", {campground : foundCampground});
       }
    });
});

// EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campground/edit", {campground: foundCampground});
    })
});
// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})
// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
});


module.exports = router;