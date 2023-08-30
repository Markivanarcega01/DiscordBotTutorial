const mongoose = require('mongoose')


const playlistSchema = new mongoose.Schema({
    guildId:{
        type:String,
        required:true
    },
    playlistName:{
        type:String,
        required:true,
        unique:true
    },
    songs:{
        type:Array,
        required:true
    }
})

module.exports = mongoose.model('Playlist',playlistSchema)