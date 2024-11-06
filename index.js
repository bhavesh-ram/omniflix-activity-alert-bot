const app = require('./app');
const logger = require('./logger');

app((error) => {
    if (error) {
        logger.error(error);
    } else {
        logger.info('App initialized');
    }
});
