const { userData } = require("../models/user.model")

let unSubscribeCMD = async (ctx) => {
    console.time(`Processing update ${ctx.update.message.update_id}`);

    // console.log("aa",typeof ctx.update.message.from.id)
    let data = ctx.update.message
    let userId = await userData.findOne({
        "userId": data.from.id
    })
    // console.log(userId)
    if (userId === null) {
        return await ctx.reply('User Allready Unsubscribed!')
    }

    let result = await userData.findOneAndDelete({
        "userId": data.from.id
    })
    // console.log(result)
    if (result) {
        await ctx.reply('You Have UnSubscribed SuccessFully ')
    } else {
        await ctx.reply('Error While Deleting User!')
    }

    console.timeEnd(`Processing update ${ctx.update.message.update_id}`);
}

module.exports = {
    unSubscribeCMD
}