const express = require('express')
const app = express()
const server = require('http').Server()

const PORT = process.env.PORT || 5001


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
