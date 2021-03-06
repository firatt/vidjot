const express = require('express');
const app = express();
const port = 5000;

const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Map global promise - to get rid of warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    // useMongoClient: true
    useNewUrlParser: true
}).then(() => {
    console.log("MongoDB Connected....");
}).catch((err) => {
    console.log(err);
});

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// Index Route
app.get(`/`, (req, res) => {
    const titlee = "Welcome";
    res.render('index', {
        title: titlee
    });
});

// About Route
app.get(`/about`, (req, res) => {
    res.render('about');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text:'Please add a title'});
    }

    if (!req.body.details) {
        errors.push({text:'Please add some details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        res.send('passed');
    }

    
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});