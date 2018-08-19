// Setup
var express     = require("express"),
    app         = express(),
    flash       = require("connect-flash"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    methodOverride = require("method-override");

//Requiring Routes
var campgroundRoutes = require("./routes/campground");
var commentRoutes    = require("./routes/comment");
var indexRoutes      = require("./routes/index");

// Connect mongoose to our db
mongoose.connect(process.env.DATABASEURL);
// Telling app.js to use bodyParser
app.use(bodyParser.urlencoded({extended : true}));
// Setting view engine as ejs
app.set('view engine', 'ejs');
// Serving css
app.use(express.static(__dirname + "/public"));
// Use method override
app.use(methodOverride("_method"));
// Use flash
app.use(flash());
// Seeding Database.
// seedDB();


//======================== 
//PASSPORT CONFIG
//========================

app.use(require("express-session")({
    secret: 'Learning webdev',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Middleware to run on every page
app.use(function(req, res, next) {
   res.locals.currentUser = req.user; 
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=========================
//PASSPORT CONFIG END
//=========================


// USING REQUIRED ROUTES
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

// Listen For Server
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("YelpCamp Server Has Started!"); 
});