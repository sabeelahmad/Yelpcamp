var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


// Landing(Home) Page Route
router.get("/", function(req, res) {
    // Rendering Landing.ejs 
    res.render("landing");
});

//===================
//  AUTH ROUTES
//===================


//Show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//Handle sign up
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err) {
           req.flash("error", err.message);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function() {
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
    });
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle login
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged out successfully!");
   res.redirect("/campgrounds");
});


module.exports = router;


