const { omniflixMarketplaceBot } = require('../config');

let URL = `mongodb://${omniflixMarketplaceBot.address}:${omniflixMarketplaceBot.port}/${omniflixMarketplaceBot.name}`;
if (omniflixMarketplaceBot.username.length && omniflixMarketplaceBot.password.length) {
    URL = `mongodb://${omniflixMarketplaceBot.username}:${omniflixMarketplaceBot.password}@${omniflixMarketplaceBot.address}:${omniflixMarketplaceBot.port}/${omniflixMarketplaceBot.name}`;
}

module.exports = URL;
