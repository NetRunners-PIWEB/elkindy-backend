const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    price: Number,
    status: {
         type: String, 
         enum: ['valid', 'expired', 'canceled'] },
    event: {
         type: Schema.Types.ObjectId, 
         ref: 'Event' },
    user: { 
        type: Schema.Types.ObjectId,
         ref: 'Users' }
});

module.exports = mongoose.model("Ticket", ticketSchema);