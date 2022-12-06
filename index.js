const { Telegraf } = require('telegraf');
const dotenv = require('dotenv').config()
const connectDB = require("./config/db");

const { HelpMsg, joinBot } = require('./src/template');
const { subscribeCMD } = require('./src/subscribe');
const { unSubscribeCMD } = require('./src/unsubscribe');
// uncomment this to fetch data
const { listingsFetch } = require('./src/listDataFetching');
const { auctionFetch } = require('./src/dataFetching');
// const { bidsFetch } = require('./src/dataFetching');
const { activityFetch } = require('./src/activityFetching');

const { auctionNotificationSend } = require('./src/notification');
const { notificationSendList } = require('./src/notificationListing');


connectDB()


const bot = new Telegraf(process.env.token);
bot.command('join',async (ctx) =>{
    console.time(`Processing update ${ctx.update.message.update_id}`);
   await ctx.reply(joinBot) 
   console.timeEnd(`Processing update ${ctx.update.message.update_id}`);
})
bot.command('help',async (ctx) =>{
    console.time(`Processing update ${ctx.update.message.update_id}`);
   await ctx.reply(HelpMsg) 
   console.timeEnd(`Processing update ${ctx.update.message.update_id}`);
})
bot.command('subscribe',subscribeCMD);
  
bot.command('unsubscribe',unSubscribeCMD)

bot.launch();
console.log("App is running")

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


// sample message
// message: {
//     message_id: 31,
//     from: {
//       id: 900794755,
//       is_bot: false,
//       first_name: 'BlockEater',
//       username: 'BlockEater'
//     },
//     chat: {
//       id: -837257700,
//       title: 'TELEGRAM-bot demo-group',
//       type: 'group',
//       all_members_are_administrators: true
//     },
//     date: 1669728465,
//     text: '/text',
//     entities: [ [Object] ]
//   }