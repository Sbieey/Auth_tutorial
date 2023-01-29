'use-script'
require('dotenv').config
module.exports = {
    'development': process.env.DATABSE_URL,
    'dialect': 'postgres',

    pool:{
        max: 5, 
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  }