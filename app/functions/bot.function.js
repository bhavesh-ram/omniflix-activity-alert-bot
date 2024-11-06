const collectionController = require('../controllers/collection_notification.controller');
const channelController = require('../controllers/channel.controller');
const faqAndGuidesController = require('../controllers/faqs_and_guides.controller');
const notificationsController = require('../controllers/notifications.controller');
const userController = require('../controllers/user.controller');


module.exports = (bot) => {
    bot.command('start', userController.startMsg);

    bot.command('about',userController.about);
    bot.command('omniflix',userController.omniflix);
    bot.command('join',userController.join);
    bot.command('help',userController.help);
    bot.command('subscribe', userController.subscribe);
    bot.command('unsubscribe',userController.unSubscribeCMD)
    
    bot.command('changeaddress', userController.changeAddress);
    bot.command('notinterested', notificationsController.notificationNotIntrestedIn);
    bot.command('interested', notificationsController.notificationIntrestedIn);
    bot.command('addcollection', collectionController.subscribedCollectionNotification);
    bot.command('removecollection', collectionController.unSubscribedCollectionNotification);
    bot.command('subscribechannel', channelController.subscribedChannelsNotification);
    bot.command('unsubscribechannel', channelController.unSubscribedChannelsNotification);
    bot.command('faq', faqAndGuidesController.faq);
    bot.command('guides', faqAndGuidesController.guides);
    bot.action(/selectf_.+/, faqAndGuidesController.faqHandler);
    bot.action(/selectg_.+/, faqAndGuidesController.guideHandler);
    bot.action(/toggle_.+/, notificationsController.toggleHandler);
    bot.on('message', userController.messageCMD)
};
