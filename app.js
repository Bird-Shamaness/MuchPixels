/**
 * Loading dependancies
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
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

/**
 * Multer configuration
 */
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
    fileSize: 30000000,
    files: 1
  }
});

/**
 * Load environment variables from .env file if in development mode, where API keys and passwords are configured
 */
if (!process.env.isProduction) {
  dotenv.load({
    path: '.env.globals'
  });
}

const cloudinary = require('cloudinary');

/**
 * Establishing Mongo connection
 */
const data = require('./data')(process.env.MONGOLAB_URI || process.env.MONGODB_URI);

/**
 * Loading pasport config file
 */
const passportConfig = require('./config/passport/passport'),
  passport = passportConfig.passport;

/**
 * Loading controllers
 */
const homeController = require('./controllers/home-controller');
const userController = require('./controllers/user-controller')(data, passportConfig.passport);
const contactController = require('./controllers/contact-controller');
const uploadController = require('./controllers/upload-controller')(data, cloudinary);
const photoController = require('./controllers/photo-controller')(data);
const profileController = require('./controllers/profile-controller')(data);
const errorController = require('./controllers/error-controller');
const messengerController = require('./controllers/messenger-controller');
const searchController = require('./controllers/search-controller')(data);
const commentController = require('./controllers/comment-controller')(data);

const controllers = {
  homeController,
  userController,
  contactController,
  uploadController,
  photoController,
  profileController,
  errorController,
  messengerController,
  searchController,
  commentController
};

/**
 * Creating Express server.
 */
const app = express();

app.set('port', process.env.PORT || 3000);
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
 * Routing configuration
 */
require('./config/router')(app, passportConfig, controllers, upload);

/**
 * Error handler
 */
app.use(errorHandler());

/**
 * Socket io require configuration.
 */
const server = require('http').createServer(app);
const io = require('./config/io.config.js').listen(server);

app.start = app.listen = function () {
  return server.listen.apply(server, arguments)
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public');
});

app.use(express.static(__dirname + '/public'));

/**
 * Start Express server.
 */
app.start(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
});

module.exports = app;