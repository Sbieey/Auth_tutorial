const config = require('../config/config')
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL)
    // try {
    //     const conn = sequelize.authenticate()
    //     console.log('Connected to DB.')
    // } catch (error) {
    //     console.log('Unable to connect to DB')
    // }

    sequelize.authenticate().then(()=>{
        console.log('DB_Connection has been established successfully.')
    }).catch((err)=> console.log(err.message))
    