const dotenv = require('dotenv').config()
const https = require('https')

const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");

let listingHelper = async (activity) =>{
    // console.log(activities)
    let user_chatId = []
    await userData.find({
        "isSubscribe": true
    }, async (error, result) => {
        if(error){
            return console.log(error)
        } else if (result && result.length) {
            user_chatId.splice(0,)
            result.forEach(user => {
                user_chatId.push(user.userId)
            })
        } else {
            return console.log("no User subscribed")
        }
    }).clone()
    console.log(user_chatId)
        let msg = `New Listing On MarketPlace.Click the below Link(https://omniflix.market/nft/${nftId})`
        user_chatId.forEach( (chatid) => {
            let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
            console.log("target",target)
            https.get(target, (res) => {
                return console.log('Auction Telegram Notification sent')
            })
        })
        ActivityData.findOneAndUpdate({
            "nftId":activity.nft_id.id,
            "tx_hash":activity.tx_hash,
            "id":activity.id
        },{
            $set:{
                "isNotified": true,
            }
        },async(error) =>{
            if(error){
                return console.log(error)
            }
        })
    

}



module.exports ={
    listingHelper
}