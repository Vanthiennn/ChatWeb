const mongoose = require('mongoose')
// const Room = require('./roomModel')

const MessageSchema = new mongoose.Schema(
    {
        room: { type: String, require: true },
        message: { text: { type: String, required: true } },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', MessageSchema)