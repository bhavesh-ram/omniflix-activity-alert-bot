const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    listId:{
        type:String,
        required:true,
        unique:true,
    },
    nftId:{
        type:String,
        required:true,   
    },
    isNotified:{
        type:Boolean,
        default:false
    }
})

listSchema.index({ listId: 1 });
const listData = mongoose.model('listings',listSchema)
module.exports = { listData:listData };