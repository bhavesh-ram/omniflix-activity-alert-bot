const mongoose = require("mongoose")
const dotenv = require('dotenv').config()

const connectDB = async () =>{
    try {
        if(process.env.DATABASE_NAME != undefined && process.env.DATABASE_URI != undefined ){
            // console.log("aaa")
            mongoose.connect(`${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`,{useNewUrlParser: true, useUnifiedTopology: true})
            // process.env.MONGO_URI
            console.log(`database connected to ${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`);
        }else{
            // console.log("aa")
            mongoose.connect('mongodb://localhost:27017/marketplace_bot',{useNewUrlParser: true, useUnifiedTopology: true})
            // process.env.MONGO_URI
            console.log("database connected to mongodb://localhost:27017/marketplace_bot");
        }
        

        
    } catch (error) {
        console.log(error)
        process.exit(1)
        
    }
}

module.exports =connectDB

