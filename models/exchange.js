
const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderInstrument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument',
        required: true
    },
    receiverInstrument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument',
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'rejected'],
        default: 'requested'
    }
}, { timestamps: true });

const Exchange = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchange;
