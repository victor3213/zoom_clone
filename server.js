const express = require('express')
const app = express()
const server = require('http').Server(app)
const { v4: uuidV4 } = require('uuid')
const { Server } = require("socket.io");
const io = new Server(server);

const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        // ? to add users to stream
        socket.to(roomId).emit('user-connected', userId)
        // ? seding message
        socket.on('message', message => {
            // ? send message back
            io.to(roomId).emit('createMessage', message)
        })
    })
});

server.listen(process.env.PORT||3030)