const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const db = require('../models')
const User = db.users
const Op = db.Sequelize.Op
const {authSchema} = require('../helpers/validate_Schema')
const {signAccessToken} = require('../helpers/jwt_helper')
const bcrypt = require('bcrypt')


router.post('/register', async(req,res,next)=>{
    try {
        // const {email, password} = req.body
        // if(!email || !password) throw createError.BadRequest()
            const result = await authSchema.validateAsync(req.body)
            
            const doesExist = await User.findOne({
                where: {
                    email: result.email
                }
            })
            console.log({doesExist})
        if(doesExist) 
            throw createError.Conflict(`${result.email} is already been registered`)
            
            const user = new User(result)
            const savedUser = await user.save()
            const accessToken = await signAccessToken(savedUser.id)
            res.send({accessToken})
    } catch (error) {
        if(error.isJoi === true) error.status = 422 
        next(error)
    }
})

router.post('/login', async(req,res,next)=>{
    try{
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({
            where: {
                email: result.email
            }
        })
        if(!user) throw createError.NotFound('User not registered')
        const isMatch = await bcrypt.compare(result.password, user.password);

        if(!isMatch) throw createError.Unauthorized('Username/Password is not valid')

        const accessToken = await signAccessToken(user.id)

        res.send({accessToken})
        }catch(error){
        if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"))
        next(error)
    }
})

router.post('/refresh-token',async(req,res,next)=>{
    res.send('refresh-token route')
})

router.delete('/logout', async(req,res,next)=>{
    res.send('logout route')
})

module.exports = router

 // var isValidPassword = function(userpass, password) {
        //     return bCrypt.compareSync(password, userpass);
        // }
        // const isMatch = await user.isValidPassword(result.password)