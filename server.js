const express = require('express')
const app = express()
const server = require('http').Server()
const socketio = require('socket.io')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 5001


const io = socketio(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

// ? connection to room with socket io
io.serveClient(true);
io.on('connection', socket => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        // ? add user to stream
        socket.to(roomId).broadcast.emit('user-connected')
    })
})



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
