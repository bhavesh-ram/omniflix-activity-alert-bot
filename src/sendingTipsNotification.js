var cron = require('node-cron');
const { tipData } = require("../models/tip.model");
const { MsgTipReceivedOnHelper } = require("../helpers/tips.helper");

let tipsScheduler = async () => {
    await tipData.find({
        "isNotified": false
    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 1
    }, async (error, tips) => {
        if (error) {
            console.log(error)
        } else if (tips && tips.length) {
            tips.forEach(async (tip) => {
                MsgTipReceivedHelper(tip)
            })
        } else {
            return console.log("No tips Present")
        }
    })
};

let tipsSchedulerData = cron.schedule('*/15 * * * * *', tipsScheduler);

module.exports = {
    tipsSchedulerData,
}