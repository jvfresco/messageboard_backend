const express = require('express')
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose')
const app = express()
const MONGODB_URI = process.env.MONGODB_URI
const helmet = require('helmet')
const compression = require('compression')
const client = process.env.CLIENT

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())


//Headers to avoid cors errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({message: message, data: data})
})

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require('./socket').init(server, client); //Socket.io initialization
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));


