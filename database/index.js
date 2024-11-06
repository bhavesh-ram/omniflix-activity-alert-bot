const async = require('async');
const mongoose = require('mongoose');
const omniflixMarketplaceBotURI = require('./omniflix_marketplace_bot');
const logger = require('../logger');

const options = {
    maxPoolSize: 16,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

module.exports = {
    init: (cb) => {
        async.waterfall([
            (next) => {
                module.exports.omniflixMarketplaceBot = mongoose.createConnection(omniflixMarketplaceBotURI, options, (error) => {
                    if (error) {
                        console.error(error);
                        next(error);
                    } else {
                        logger.info(`Connected to database: ${omniflixMarketplaceBotURI}`);
                        next(null);
                    }
                });
            },
        ], cb);
    },
};
