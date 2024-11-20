const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
    description: String,
    status: { type: String, default: 'Open' }
});

module.exports = mongoose.model('Ticket', TicketSchema);