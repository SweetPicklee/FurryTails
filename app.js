var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	LocalStrategy = require('passport-local'),
	flash = require('connect-flash'),
	Pet = require('./models/pet'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	session = require('express-session'),
	methodOverride = require('method-override');

//requiring routes
var commentRoutes = require('./routes/comments'),
	petRoutes = require('./routes/pets'),
	indexRoutes = require('./routes/index');

mongoose.connect('mongodb+srv://Francis:Hallglen@furrytales-kikl4.gcp.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'Once again Rusty wins cutest dog!',
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', indexRoutes);
app.use('/pets', petRoutes);
app.use('/pets/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, function() {
	console.log('The YelpCamp Server Has Started!');
});
