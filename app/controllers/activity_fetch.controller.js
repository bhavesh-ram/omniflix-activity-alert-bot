const async = require('async');
const request = require("request")
const cron = require('node-cron');
const activityDBO = require('../dbos/activity.dbo');
const activityHelper = require('../helpers/activity.helper');
const logger = require("../../logger");
const config = require('../../config');

const activityFetching = () => {
    async.waterfall([
        (next) => {
            activityDBO.find({}, {}, {
                sort: {
                    created_at: 'desc'
                },
                limit: 10
            }, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length > 0) {
                    next(null, result[0].created_at);
                } else {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    next(null, yesterday);
                }
            });
        }, (result, next) => {
            const createdFrom = new Date(result).toUTCString();
            const url = `${config.omniflix.activityUrl}/activity-bot?createdFrom=${createdFrom}&sortBy=created_at&order=asc&limit=2000`;
            const options = { json: true };
            request(url, options, (error, res, body) => {
                if (error) {
                    next(error);
                } else if (res && res.statusCode === 200) {
                    if (body && body.result && body.result.list) {
                        next(null, body.result.list);
                    } else {
                        next(null, []);
                    }
                } else {
                    next(null, []);
                }
            });
        }, (activities, next) => {
            async.forEachLimit(activities, 1, (activity, cb) => {
                activityDBO.findOne({
                    "_id": activity._id
                }, {}, {}, false, (error, result) => {
                    if (error) {
                        cb(error);
                    } else if (result) {
                        cb(null);
                    } else {
                        activity.isNotified = false;
                        activityHelper.addActivity(activity, (error) => {
                            if (error) {
                                cb(error);
                            } else {
                                cb(null);
                            }
                        })
                    }
                })
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const activityFetch = cron.schedule('*/20 * * * * *', activityFetching)

activityFetch.start()

module.exports = {
    activityFetch
}
