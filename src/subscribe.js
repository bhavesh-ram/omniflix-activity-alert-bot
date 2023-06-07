let { bech32 } = require('bech32')
const { userData } = require("../models/user.model")

let messageCMD = async (ctx) => {
    console.time(`Processing update ${ctx.update.message.update_id}`);
    let words = ['chihuahua', 'mantle', 'cosmos', 'osmo', 'secret', 'akash', 'star', 'certik', 'regen', 'persistence', 'sent', 'juno', 'kava', 'stars']
    if (ctx.message.text == '/help' ||
        ctx.message.text == '/omniflix' ||
        ctx.message.text == '/about' ||
        ctx.message.text == '/start' ||
        ctx.message.text == '/join' ||
        ctx.message.text == '/subscribe') {
        console.log(ctx.message.text)

    }else if(!words.includes(ctx.message.text) && !ctx.message.text){
        // console.log(ctx.message.text)
    }else if (ctx.message.text.slice(0, 8) == 'omniflix') {
        if (parseInt(ctx.message.text.slice(8,).length) != 39) {
            return await ctx.reply('Add a correct OmniFlix address for accurate updates.')
        }
        // console.log(ctx.update.message)
        let data = ctx.update.message
        let doc = {
            userId: data.from.id,
            username: data.from.username,
            isSubscribe: true,
            omniflixAddress: ctx.message.text,
            chatDate: new Date(data.date * 1000)
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
    }else {
        
        let str = ctx.message.text
        let found = false;
        for (const word of words) {
            const index = str.indexOf(word);
            if (index !== -1) {
                await ctx.reply('Add a correct OmniFlix address for accurate updates.')
                found = true;
                break;
            }
        }
        // if (!found) {
        //     console.log("None of the words in the array are Not present in the string");
        // }
    }
}

module.exports = {
    // subscribeCMD,
    messageCMD
}