const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    guildId:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        default:0
    },
    lastDaily:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('User',userSchema)