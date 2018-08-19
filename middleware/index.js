var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // check if user is logged in or not
   if(req.isAuthenticated()) {
       // find campground
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err || !foundCampground) {
                req.flash("error", "Seems like the campground could not be found.");
                res.redirect("back");
            } else {
              //check if user owns campground
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    // check if user is logged in or not
   if(req.isAuthenticated()) {
       // find comment
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
              //check if user owns comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}


module.exports = middlewareObj;