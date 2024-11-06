const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    omniflixMarketplaceBot: {
        address: process.env.OMNIFLIX_MARKETPLACE_BOT_ADDRESS || 'localhost',
        port: process.env.OMNIFLIX_MARKETPLACE_BOT_PORT || 27017,
        name: process.env.OMNIFLIX_MARKETPLACE_BOT_NAME || 'marketplace_bot',
        username: process.env.OMNIFLIX_MARKETPLACE_BOT_USERNAME || '',
        password: process.env.OMNIFLIX_MARKETPLACE_BOT_PASSWORD || '',
    },
    bot: {
        token: process.env.BOT_TOKEN,
    },
    omniflix: {
        studioUrl: process.env.STUDIO_API_URL,
        datalayerUrl: process.env.DATALAYER_COLLECTION_URL,
        activityUrl: process.env.ACTIVITY_URL,
    }
};