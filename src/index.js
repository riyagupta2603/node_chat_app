const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, reUser, getUser, getusersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))

// let count = 0


io.on('connection', (socket) => {
    console.log("new websocket connection ")

    // socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })



    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined! `))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getusersInRoom(user.room)
        })

        callback()
        //socket.emit, io.emit, socket.broadcast.emit
        //inro for room ->io.to.emit(emit to everybody in the room except other room ), socket.broadcast.to.emit(send in specific room but except the sender)
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('sendPosition', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('location', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('received')
    })
    socket.on('disconnect', () => {
        const user = reUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getusersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is on port ${port}`)
})