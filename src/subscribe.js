let { bech32} = require('bech32')
const { userData } = require("../models/user.model")
// const {  } = require('./src/template')

let subscribeCMD = async (ctx) => {

    console.time(`Processing update ${ctx.update.message.update_id}`);
    
    let inputCMD = ctx.update.message.text.split(' ')
  
    if(inputCMD[0] == "/subscribe" && inputCMD[1] == undefined){
        
        return await ctx.reply('Need To Add OmniFlix Adress Too')
    }
    console.log(parseInt(inputCMD[1].slice(8,).length) != 39)
    console.log(inputCMD[1].slice(0,8) == 'omniflix')
  
    if(inputCMD[1].slice(0,8) != "omniflix" || parseInt(inputCMD[1].slice(8,).length) != 39 ){
        return await ctx.reply('Enter Valid Omniflix Address')
    }

    let data = ctx.update.message
    let doc = {
        userId: data.from.id,
        username: data.from.username,
        isSubscribe: true,
        omniflixAddress: inputCMD[1],
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