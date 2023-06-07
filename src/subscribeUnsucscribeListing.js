const { userData } = require("../models/user.model")

const subscribeListing = async (ctx) => {
    let data = ctx.update.message
    let userId = await userData.findOne({
        "userId": data.from.id
    })
    if (userId === null) {
        return await ctx.reply('Subscribe The Bot first Your not subscribed Yet')
    }
    if(userId.isSubscribe === true){
        let result = await userData.findOneAndUpdate({
            "userId": data.from.id},{
                $set:{isListingNotified:true}
        })
        if(result){
            await ctx.reply("You Subscribed to Listing notification")
        }
    }
    // console.log(userId.isSubscribe)
}
const unSubscribeListing = async (ctx) => {
    let data = ctx.update.message
    let userId = await userData.findOne({
        "userId": data.from.id
    })
    if (userId === null) {
        return await ctx.reply('Subscribe The Bot first Your not subscribed Yet')
    }
    if(userId.isSubscribe === true){
        let result = await userData.findOneAndUpdate({
            "userId": data.from.id},{
                $set:{isListingNotified:false}
        })
        if(result){
            await ctx.reply("You Unsubscribed to Listing notification")
        }
    }
}

module.exports = {
    subscribeListing,
    unSubscribeListing
}
