// https://omniflix.market/nft/onft1573f151b21b45489584c034c5140ae7


var cron = require('node-cron');
const { userData } = require('../models/user.model');
const dotenv = require('dotenv').config()
const https = require('https')
// const { auctionData } = require("../models/auction.model");
const { listData } = require('../models/list.model');

let user_chatId = []
let notificationSendList = cron.schedule('5 * * * * *', function () {
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
    listData.find({
        "isNotified": false
    },(error, result) => {
        if (error) {
            console.log(error)
        } else if (result && result.length) {
            result.forEach(listing => {
                let msg = `New Listing On MarketPlace.\nClick the below Link \n(https://omniflix.market/nft/${listing.nftId})`
                user_chatId.forEach(chatid => {
                    let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
                    // console.log(target)
                    https.get(target, (res) => {
                        console.log('listing notif telegram sent')
                    })
                    // console.log(auction.nftId)
                    listData.findOneAndUpdate({
                        "listId":listing.listId
                        
                    },{
                        $set:{
                            "isNotified": true,
                        }
                    },async(error) =>{
                        if(error){
                            console.log(error)
                        }
                    })
                })
            })
        } else {
            console.log("No new listing found")
        }
    })
    
});

notificationSendList.start()

module.exports = {
    notificationSendList
}