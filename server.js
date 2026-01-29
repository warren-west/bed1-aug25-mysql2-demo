require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')

// import the router object
const studentsRouter = require('./routes/students')

// configure EJS as the view engine
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")

// wire up the route to the main server object
app.use('/students', studentsRouter)

// GET /
app.get('/', (req, res) => {
    console.log(req.method)
    console.log(req.url)

    res.write(`You pinged ${req.method} ${req.url}.`)
    res.end()
})

const port = process.env.PORT || '3000'

// let the server listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
})