const { userData } = require("../models/user.model")

let subscribeCMD = async (ctx) => {
    console.time(`Processing update ${ctx.update.message.update_id}`);
    
    let data = ctx.update.message
    let doc = {
        userId: data.from.id,
        username: data.from.username,
        groupId: data.chat.id,
        isSubscribe: true,
        chatDate: new Date(data.date*1000)
    }
    // console.log(doc)
    let userId = await userData.findOne({
        userId: data.from.id
    })

    if (userId !== null) {
            return await ctx.reply('User Allready Subscribed!')

    }

    let userD = new userData(doc)
    let result = await userD.save()
    //    console.log(result)
    if (!result) {
        // console.log(error)
        await ctx.reply('Error While Saving User!')
    } else {
        await ctx.reply('You Have Subscribed SuccessFully.')

    }
    console.timeEnd(`Processing update ${ctx.update.message.update_id}`);
}

module.exports = {
    subscribeCMD
}