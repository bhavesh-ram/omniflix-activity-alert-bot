const { userData } = require("../models/user.model")
const { Markup } = require('telegraf');


let notificationNotIntrestedIn = async (ctx) => {
    const userId = ctx.update.message.from.id

    let user = await userData.findOne({ userId });

    if (!user) {
        ctx.reply('User not found.');
        return;
    }

    if (!user.notificationTypes) {
        user.notificationTypes = [];
      }
    
    const notificationTypes = [
        'New Auction Creation',
        'NFT Listings',
        'Multiple NFT Listings',
        'Multiple Auctions Creation',
        'Campaign Creation',
        'End Campaign',
        'New Interactive Content',
        'New Channels'
    ];

    const keyboard = notificationTypes.map((type) => {
        const isChecked = user.notificationTypes.includes(type);
        return [Markup.button.callback(type, `toggle_${type}`, isChecked)];
      });
    
      const replyMarkup = Markup.inlineKeyboard(keyboard);
      ctx.reply('Select which notifications you’d like to turn back on',replyMarkup);
}


let toggleHandler = async (ctx) => {
    const userId = ctx.from.id;
    const callbackData = ctx.callbackQuery.data;
    let notificationType;
    if (/^toggle__/.test(callbackData)) {
        notificationType = callbackData.replace('toggle__', '');
        let user = await userData.findOne({ userId });

        if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (!user.notificationTypes) {
            user.notificationTypes = [];
        }
        // Toggle the notification type
        const index = user.notificationTypes.indexOf(notificationType);
        console.log(index)
        if (index === -1) {
            user.notificationTypes.push(notificationType);
        } else {
            // Remove the notification type if already present
            user.notificationTypes.splice(index, 1);
        }

        await user.save();
        ctx.deleteMessage();

        // Inform the user about the update
        ctx.reply(`Notification Preferences Saved.\n To modify further, simply run the command again!`);


    } else if (/^toggle_/.test(callbackData)) {
        notificationType = callbackData.replace('toggle_', '');
        let user = await userData.findOne({ userId });

        if (!user) {
            ctx.reply('User not found.');
            return;
        }
        if (!user.notificationTypes) {
            user.notificationTypes = [];
        }
        const index = user.notificationTypes.indexOf(notificationType);
        console.log(index)
        if (index === -1) {
            user.notificationTypes.push(notificationType);
        } else {
            // Remove the notification type if already present
            user.notificationTypes.splice(index, 1);
        }

        await user.save();
        ctx.deleteMessage();

        // Inform the user about the update
        ctx.reply(`Notification Preferences Saved.\n To modify further, simply run the command again!`);
        
        

    } else {
        return; // Invalid callback data format, handle the error accordingly
    }


  
  }
  
  
let notificationIntrestedIn = async (ctx) => {
    const userId = ctx.update.message.from.id

    let user = await userData.findOne({ userId });

    if (!user) {
        ctx.reply('User not found.');
        return;
    }

    if (!user.notificationTypes) {
        user.notificationTypes = [];
      }
    
    const notificationTypes = user.notificationTypes

    const keyboard = notificationTypes
  .filter((type) => user.notificationTypes.includes(type))
  .map((type) => [Markup.button.callback(type, `toggle__${type}`, false)]);

const replyMarkup = Markup.inlineKeyboard(keyboard);
ctx.reply('Click notification your intrested in:', replyMarkup);;

}
  

module.exports = {
    notificationNotIntrestedIn,
    notificationIntrestedIn,
    toggleHandler
}