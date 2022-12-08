let url = "https://data-api.omniflix.studio/bids?statuses[]=PLACED&statuses[]=ACCEPTED&statuses[]=CLOSED&auctionId=63875e12d95a6cdcd1304e0a&limit=20"

var cron = require('node-cron');
const { userData } = require('../models/user.model');
const dotenv = require('dotenv').config()
const https = require('https')

let user_chatId = []
let bidNotificationSend = cron.schedule('8 * * * * *', function () {
    userData.find({
        "isSubscribe": true
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result && result.length) {
            user_chatId.splice(0,)
            result.forEach(user => {
                user_chatId.push(user.userId)
            })
        } else {
            return console.log("no User subscribed")
        }
    })

})

bidNotificationSend.start()
module.exports ={
    bidNotificationSend
}