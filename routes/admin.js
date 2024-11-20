const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');

// Admin register route
router.get('/register', (req, res) => {
    res.render('adminRegister', { message: req.flash('message') });
});

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            req.flash('message', 'You are already registered');
            return res.redirect('/admin/register');
        }
        const newAdmin = new User({ email, username, password });
        await newAdmin.save();
        res.redirect('/admin/login');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/register');
    }
});

// Admin login route
router.get('/login', (req, res) => {
    res.render('adminLogin', { message: req.flash('message') });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await User.findOne({ username });
        if (!admin || admin.password !== password) {
            req.flash('message', 'Invalid email id or password');
            return res.redirect('/admin/login');
        }
        req.session.adminId = admin._id;
        res.redirect('/admin/panel');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/login');
    }
});

// Admin panel route
router.get('/panel', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    const tickets = await Ticket.find().populate('userId', 'username email');
    res.render('adminPanel', { tickets });
});

// Change ticket status
router.post('/tickets/:id/status', async (req, res) => {
    const { status } = req.body;
    await Ticket.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/panel');
});

// Delete ticket
router.post('/tickets/:id/delete', async (req, res) => {
    await Ticket.findByIdAndDelete(req.params.id);
    res.redirect('/admin/panel');
});

module.exports = router;