const { userData } = require("../models/user.model")

const changeAddress = async (ctx) => {
    // console.log('text',ctx.message.text);
    const accountAddress = ctx.message.text.split(' ')[1];
    const userId = ctx.update.message.from.id
    if(!accountAddress){
        ctx.reply('Add Omniflix address with command! \neg. /changeaddress omniflix17d2f5cbhghiii6432dc8820dhrt6dg');
    } else if (accountAddress.startsWith('omniflix')) {
        let user = await userData.findOneAndUpdate(
            { userId },
            { $set: { omniflixAddress: accountAddress } },
            { returnOriginal: false }
          );
          if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (user) {
            ctx.reply('Omniflix Address Updated Successfully!');
        }
    } else {
        ctx.reply('Add a correct OmniFlix address for accurate updates.')
    }
}

module.exports = {
    changeAddress,

}