var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
           res.render("comment/new", {campground : campground});
       }
   });
});


router.post("/", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
      if(err) {
          console.log(err);
          res.redirect("/campgrounds");
      } else {
          Comment.create(req.body.comment, function(err, comment) {
              if(err) {
                  req.flash("error", "Something went wrong. Try again!");
                  console.log(err);
              } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Comment added successfully!");
                res.redirect("/campgrounds/" + campground._id);
              }
          });
      }
   }); 
});

// ============== EDIT ROUTE ================= //
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found.");
            return res.redirect("back");
        }
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err) {
                    res.redirect("back");
                } else {
                    // Since original route has :id as well
                    res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
                }
        });
    });
});

// ========= UPDATE ROUTE ============= //
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
     if(err) {
         res.redirect("back");
     }  else {
         res.redirect("/campgrounds/" + req.params.id);
     }
   });
});

//============= DESTROY ===============//
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if(err) {
          res.redirect("back");
      } else {
          req.flash("success", "Comment deleted successfully!");
          res.redirect("/campgrounds/" + req.params.id)
      }
  }); 
});


module.exports = router;