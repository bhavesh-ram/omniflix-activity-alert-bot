const async = require('async')
const activityDBO = require('../dbos/activity.dbo');

const addActivity = (activity, cb) => {
    async.waterfall([
        (next) => {
            activityDBO.save(activity, false, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            })
        },
    ], cb);
};

module.exports = {
    addActivity,
}
