'use strict';

const { UUID } = require("sequelize");
const bcrypt = require('bcrypt');
const { password } = require("pg/lib/defaults");
// const { Hooks } = require("sequelize/dist/lib/hooks");

  module.exports = (sequelize, DataTypes)=>{
      const User = sequelize.define("User",{
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
          },
          email: {
            type:DataTypes.STRING,
            require:true,
            lowercase:true,
            unique:true
          },
          password:{
            type:DataTypes.STRING,
            require:true
          }
        })
        // hooks:{
        //   beforeSave: (User) =>{
        //     console.log('called before saving')
        //   }
        //    afterSave: (User) =>{
        //     console.log('called after saving')
        //   }
        // }
        /// SEQUELIZE HOOKS --###
        User.beforeSave( async (user)=>{
          const salt =  await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(user.password, salt)
          user.password = hashedPassword
        })  

        instanceMethods: {
          validPassword: (password) =>{
            return bcrypt.compareSync(password, this.password)
          }
        }

        User.prototype.validPassword = async (password, hash) => {
          return await bcrypt.compareSync(password, hash)
        }

        // beforeUpdate:async (user) =>{

        // }
        // User.afterSave((user)=>{
        //   console.log('called after saving')
        // }) 
        
        
        return User
  }