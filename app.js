const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_connect')
const db = require('./models')
// db.sequelize.sync()
const AuthRoute = require('./routes/Auth.route.js') 
const { verifyAccessToken } = require('./helpers/jwt_helper')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
const PORT  = process.env.PORT || 8080

app.get('/', verifyAccessToken, async(req,res,next)=>{
    res.send('Hello from express')
})

app.use('/auth/', AuthRoute)

app.use(async(req,res,next)=>{
    // const error = new Error('Not found')
    // error.status = 404
    // next(error)
    next(createError.NotFound('This route does not exist.'))
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status || 500,
            message: err.message
        }
    })
})



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}...`)
})