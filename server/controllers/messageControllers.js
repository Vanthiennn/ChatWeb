const Message = require('../model/messageModel')
const Room = require('../model/roomModel')
const getMessage = async (req, res) => {
    try {
        const { users, roomID } = req.body
        const matchRoom = await Room.findOne({ _id: roomID })
       
        if (matchRoom) {
            const message = await Message.find({
                users: {
                    $all: users,
                },
            }).sort({ updateAt: 1 })

            const chatMessage = message.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === users[0],
                    msg: msg.message.text
                }
            })
            res.json(chatMessage);
        }
    } catch (err) {
      
    }
}

const addMessage = async (req, res) => {
    try {

        const { users, msg, roomID } = req.body

        const existingRoom = await Room.findOne({ _id: roomID });
        if (existingRoom) {
            const data = await Message.create({
                room: existingRoom._id,
                message: { text: msg },
                users: users,
                sender: users[0],
            })
            if (data) return res.json({ message: "Message added successfully." })
            else return res.json({ msg: "Failed to add message to the database" });
        }

    } catch (err) {
       
    }
}

module.exports = { getMessage, addMessage }