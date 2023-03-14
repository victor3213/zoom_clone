const express = require('express')
const app = express()
const server = require('http').Server()
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 5001


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
