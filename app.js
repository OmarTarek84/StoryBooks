const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const csurfProtection = csurf();
const multer = require('multer');
const mongoose = require('mongoose');
const compression = require('compression');

const User = require('./models/user');

const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const store = new MongoDBStore({
    uri: 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@cluster1-tmn4p.mongodb.net/storybooks',
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: 'mySecret',
    saveUninitialized: false,
    resave: false,
    store: store
}));

app.use(csurfProtection);

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        throw new Error(err);
    });
});

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isLoggedIn;
    if(req.session.user) {
        res.locals.username = req.user.firstname;
        res.locals.idUser = req.session.user._id.toString();
    } else {
        res.locals.idUser = null;
    }
    next();
});

app.use(indexRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.use(compression());

app.use((error, req, res, next) => {
    res.status(500).render('500', {
        title: 'Server Down',
        isAuthenticated:  req.session.isLoggedIn
    });
});

app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@cluster1-tmn4p.mongodb.net/storybooks')
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });