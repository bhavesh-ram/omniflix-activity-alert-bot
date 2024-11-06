const request = require("request")
const cron = require('node-cron');
const interactiveVideoDBO = require('../dbos/interactive_video.dbo');
const interactiveVideoHelper = require('../helpers/interactive_video.helper');

const interactiveVideoScheduler = () => {
    async.waterfall([
        (next) => {
            interactiveVideoDBO.find({
                "isNotified": false
            }, {}, {
                sort: {
                    created_at: 'desc'
                },
                limit: 1
            }, false, (error, interactiveVideos) => {
                if (error) {
                    next(error);
                } else if (interactiveVideos && interactiveVideos.length) {
                    next(null, interactiveVideos);
                } else {
                    next('No InteractiveVideos Present');
                }
            });
        }, (interactiveVideos, next) => {
            async.forEachLimit(interactiveVideos, 1, (interactiveVideo, cb) => {
                interactiveVideoHelper.newIVPublishedHelper(interactiveVideo, (error) => {
                    if (error) {
                        cb(error);
                    } else {
                        cb(null);
                    }
                })
            }, (error) => {
                next(error);
            });
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const interactiveVideoFetching = () => {
    async.waterfall([
        (next) => {
            interactiveVideoDBO.find({}, {}, {
                sort: {
                    created_at: 'desc'
                },
                limit: 10
            }, false, (error, result) => {
                if (error) {
                    next(error);
                } else {
                    next(null, result);
                }
            });
        }, (result, next) => {
            const url = `${config.url}/tv/interactive-videos?sortBy=created_at&order=desc&limit=1000`;
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
        }, (interactiveVideos, next) => {
            async.forEachLimit(interactiveVideos, 1, (interactiveVideo, cb) => {
                interactiveVideoDBO.findOne({
                    "_id": interactiveVideo._id
                }, {}, {}, false, (error, result) => {
                    if (error) {
                        cb(error);
                    } else if (result) {
                        cb(null);
                    } else {
                        interactiveVideo.isNotified = false;
                        interactiveVideoHelper.addInteractiveVideo(interactiveVideo, (error) => {
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

const interactiveVideoSchedulerData = cron.schedule('*/15 * * * * *', interactiveVideoScheduler);

const interactiveVideoFetch = cron.schedule('*/30 * * * * *', interactiveVideoFetching)

interactiveVideoFetch.start()


module.exports = {
    interactiveVideoFetch,
    interactiveVideoSchedulerData,
}