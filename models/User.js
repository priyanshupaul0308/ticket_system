const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: String,
    username: { type: String, unique: true },
    mobile_no: String,
    email: { type: String, unique: true },
    password: String
});

module.exports = mongoose.model('User ', UserSchema);