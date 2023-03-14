const express = require('express')
const app = express()
const server = require('http').Server(app)
const { v4: uuidV4 } = require('uuid')
const { Server } = require("socket.io");
const io = new Server(server);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(process.env.PORT||3030)