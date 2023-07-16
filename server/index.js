require('dotenv').config()
const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')

const userRoutes = require('./routes/user')

//express app
const app = express()

// middleware
app.use(cors())
app.use(express.json()) //parses requests with JSON payloads

//routes
app.use('/api/user',userRoutes)

//connect to db
//mongoose.connect('mongodb://username:password@host:port/database?options...');
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log("Server started")
        })
    })
    .catch((error)=>{
        console.log(error)
    })
