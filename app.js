/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({
    dest: path.join(__dirname, 'uploads'),
    fileFilter(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        }

        cb(`Error: File upload only supports the following filetypes - ${filetypes}`);
    },
    limits: {
        fileSize: 1000000,
        files: 1
    }
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
    path: '.env.globals'
});

const data = require('./data')(process.env.MONGOLAB_URI || process.env.MONGODB_URI);

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home-controller');
const userController = require('./controllers/user-controller')(data);
const contactController = require('./controllers/contact-controller');
const uploadController = require('./controllers/upload-controller')(data);
const photoController = require('./controllers/photo-controller')(data);
const profileController = require('./controllers/profile-controller')(data);

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */

/**
 * Express configuration.
 */

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const users = [];
const connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public');
});

//  messenger logic
app.get('/messenger', function(req, res) { // тука е раута
    res.render("messenger");
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connnected', connections.length);

    // Disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected %s sockets connected', connections.length);
    });

    // Send Message
    socket.on('send message', function(data) {
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    // New User 
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users)
    }
});

//app.set('port', process.env.PORT || 3000); // in conflict with messenger server.listen/ Should be removed, logic extended in server.listen
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGOLAB_URI || process.env.MONGODB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    if (req.path === '/upload') {
        next();
    } else {
        lusca.csrf()(req, res, next);
    }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == '/account') {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
}));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', passportConfig.isAuthenticated, userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

app.get('/upload', uploadController.getPhotoUpload);
app.post('/upload', upload.single('myFile'), uploadController.postPhotoUpload);

app.get('/photo/details/:id', photoController.getPhotoDetails);
app.post('/api/photo/:id', passportConfig.isAuthenticated, photoController.postComment);
app.get('/api/photo/:id/upvote', passportConfig.isAuthenticated, photoController.putUpvote);
app.get('/api/photo/:id/unvote', passportConfig.isAuthenticated, photoController.removeUpvote);

app.get('/photo/hot', photoController.getHotPhotos);
app.get('/photo/trending', photoController.getTrendingPhotos);

app.get('/photo/edit/:id', passportConfig.isAuthenticated, photoController.getEdit);
app.post('/photo/edit/:id', passportConfig.isAuthenticated, photoController.postEdit);

app.get('/profile/:username', profileController.getUserProfile);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile email'
}));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); // replaced app.get('port') with 3000, because after socket changes port was NaN
});

module.exports = app;