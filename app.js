const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const UserRoutes = require('./routes/user');
const AdminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3004;

// Database connection
mongoose.connect('mongodb://localhost:27017/ticket_system_details');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(flash());

// Handlebars setup
app.set('view engine', 'hbs');

// Routes
app.use('/user', UserRoutes);
app.use('/admin', AdminRoutes);

// Home route
app.get('/', (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});