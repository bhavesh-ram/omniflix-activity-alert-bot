const { userData } = require("../models/user.model");
const { channelsData } = require("../models/channels.model");


const subscribedChannelsNotification = async (ctx) => {
    console.log('text',ctx.message.text);
    const channelName = ctx.message.text.split(' ')[1];
    const userId = ctx.update.message.from.id
    if(!channelName){
        ctx.reply('Add Channel Name or Channel Id with command! \neg. /subscribechannel thisisatestchannel');
    } else if (channelName) {
        try {
        let channelId;
        let channel = await channelsData.findOne({ $or: [ { name: channelName },{ username: channelName } ] });
        if (channel) {
            channelId = channel._id;
        } else {
            ctx.reply(`Invalid Channel Name ${channelName}. Please Enter a Valid Channel Name or Channel Id.`);
        }
        let user = await userData.findOne({ userId });
        if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (user && channelId) {
            user.channels.push(channelId);
            await user.save();
            ctx.reply('Channels added successfully!');
        }
        } catch (error) {
            console.log(error)
        }; 
    }
}

const unSubscribedChannelsNotification = async (ctx) => {
    console.log('text',ctx.message.text);
    const channelName = ctx.message.text.split(' ')[1];
    const userId = ctx.update.message.from.id
    if(!channelName){
        ctx.reply('Add Channel Name or Channel Id with command! \neg. /unsubscribechannel thisisatestchannel');
    } else if (channelName) {
        try {
        let channelId;
        let channel = await channelsData.findOne({ $or: [ { name: channelName },{ username: channelName } ] });
        if (channel) {
            channelId = channel._id;
        } else {
            ctx.reply(`Invalid Channel Name ${channelName}. Please Enter a Valid Channel Name or Channel Id.`);
        }
        let user = await userData.findOne({ userId });
        if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (user && channelId) {
            console.log( channelId.toString(), user.channels)
            user.channels = user.channels.filter(
                (channel) => channel !== channelId.toString()
            );
            console.log( user.channels)
            await user.save();

            ctx.reply('Channel removed successfully!');
        }
        } catch (error) {
            console.log(error)
        }; 
    }
}

module.exports = {
    subscribedChannelsNotification,  
    unSubscribedChannelsNotification
}