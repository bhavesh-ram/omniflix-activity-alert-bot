const async = require('async');
const path = require('path');
const database = require('../database');
const logger = require('../logger');
const utils = require('../utils/file.util');

const app = (cb) => {
    async.waterfall([
        (next) => {
            database.init((error) => {
                if (error) {
                    logger.error('Failed to initialize database connection!');
                    process.exit(1);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            utils.getFiles([
                './app/models/*.model.js',
            ]).forEach((modelPath) => {
                logger.info('modelPath ' + modelPath);
                require(path.resolve(modelPath));
            });

            next(null);
        }, (next) => {
            const app = require('./bot')
            next(null, app);
        }, (app, next) => {
            utils.getFiles([
                './app/functions/*.function.js',
            ]).forEach((functionPath) => {
                logger.info('functionPath ' + functionPath);
                require(path.resolve(functionPath))(app);
            });

            next(null, app);
        }, (app, next) => {
            utils.getFiles([
                './app/controllers/*.controller.js',
            ]).forEach((controllerPath) => {
                logger.info('controllerPath ' + controllerPath);
                require(path.resolve(controllerPath));
            });

            next(null, app);
        }
    ], cb);
};

module.exports = app;
