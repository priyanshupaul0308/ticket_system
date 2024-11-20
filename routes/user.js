const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');

// Register route
router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('message') });
});

router.post('/register', async (req, res) => {
    const { fullname, username, mobile_no, email, password } = req.body;
    try {
        const existingUser  = await User.findOne({ username });
        if (existingUser ) {
            req.flash('message', 'You are already registered');
            return res.redirect('/user/register');
        }
        const newUser  = new User({ fullname, username, mobile_no, email, password });
        await newUser .save();
        res.redirect('/user/login');
    } catch (error) {
        console.error(error);
        res.redirect('/user/register');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash(' message') });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            req.flash('message', 'Invalid username or password');
            return res.redirect('/user/login');
        }
        req.session.userId = user._id;
        res.redirect('/user/tickets');
    } catch (error) {
        console.error(error);
        res.redirect('/user/login');
    }
});

// Tickets route
router.get('/tickets', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/user/login');
    }
    const tickets = await Ticket.find({ userId: req.session.userId });
    res.render('tickets', { tickets });
});

// Create ticket
router.post('/tickets', async (req, res) => {
    const { description } = req.body;
    const ticket = new Ticket({ userId: req.session.userId, description });
    await ticket.save();
    res.redirect('/user/tickets');
});

// Check ticket status
router.get('/tickets/:id', async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    res.render('ticketStatus', { ticket });
});

module.exports = router;