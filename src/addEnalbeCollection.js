const { userData } = require("../models/user.model")

const subscribedCollectionNotification = async (ctx) => {
    console.log('text',ctx.message.text);
    const collectionAddress = ctx.message.text.split(' ')[1];
    const userId = ctx.update.message.from.id
    if(!collectionAddress){
        ctx.reply('Add denom Id with command! \neg. /addcollection onftdenom7d2f5cbhghiii6432dc8820d2chgr7');
    } else if (collectionAddress.startsWith('onftdenom')) {
        let user = await userData.findOne({ userId });
        if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (user) {
            user.collections.push(collectionAddress);

            await user.save();

            ctx.reply('Collection added successfully!');
        }
    } else {
        ctx.reply('Invalid denom. Please Enter a Valid Collection Address.');
    }
}

const unSubscribedCollectionNotification = async (ctx) => {
    const collectionAddress = ctx.message.text.split(' ')[1];
    const userId = ctx.update.message.from.id
    if(!collectionAddress){
        ctx.reply('Add denom ID with command! \neg. /removecollection onftdenom7d2f5cbhghiii6432dc8820d2chgr7');
    } else if (collectionAddress.startsWith('onftdenom')) {
        let user = await userData.findOne({ userId });
        if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (user) {
            user.collections = user.collections.filter(
                (collection) => collection !== collectionAddress
            );
            await user.save();

            ctx.reply('Collection removed successfully!');
        }
    } else {
        ctx.reply('Invalid denom. Please Enter a Valid Collection Address.');
    }
}

module.exports = {
    subscribedCollectionNotification,
    unSubscribedCollectionNotification,
    
};
