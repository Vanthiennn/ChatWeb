// const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const messageRoutes = require('./routes/message')
const Room = require('./model/roomModel')
const socket = require('socket.io')
const PORT = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)

const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB Connection success')
    })
    .catch((err) => {
        console.log(err, 'err')
    })

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    }
})


io.on("connection", (socket) => {

    socket.on("join_room", async data => {
        const { from, to } = data
        const users = [from, to]
        const existingRoom = await Room.findOne({
            $or: [
                { users },
                { users: [to, from] }
            ]

        });
        if (existingRoom) {
            socket.emit("room-receive", existingRoom)
            socket.join(existingRoom._id.toString());
        } else {
            const data = await Room.create({
                users: [from, to],
            })
            socket.emit("room-receive", data)
            socket.join(data._id.toString());
        }
    })
    socket.on("send-msg", (data) => {
        io.to(`${data.roomID}`).emit("msg-receive", data)
    })
})

