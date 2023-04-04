const mongoose = require('mongoose')
const User = require('./userModel')
const Message = require('./messageModel')

const RoomSchema = new mongoose.Schema({
    users: Array,
    created_at: Date,
    updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Room',RoomSchema)