var cron = require('node-cron');
const { interactiveVideoData } = require("../models/interactive_video.model");
const { channelsData } = require("../models/channels.model");
const { newIVPublishedHelper, newChannelsHelper } = require("../helpers/interactiveVideoNotification.helper");

let InteractiveVideoScheduler = async () => {
    await interactiveVideoData.find({
        "isNotified": false
    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 1
    }, async (error, interactiveVideos) => {
        if (error) {
            console.log(error)
        } else if (interactiveVideos && interactiveVideos.length) {
            interactiveVideos.forEach(async (interactiveVideoData) => {
                newIVPublishedHelper(interactiveVideoData)
            })
        } else {
            return console.log("No InteractiveVideo Present")
        }
    })
};

let ChannelScheduler = async () => {
    await channelsData.find({
        "isNotified": false
    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 1
    }, async (error, channels) => {
        if (error) {
            console.log(error)
        } else if (channels && channels.length) {
            channels.forEach(async (channel) => {
                newChannelsHelper(channel)
            })
        } else {
            return console.log("No Channels Present")
        }
    })
};
let InteractiveVideoSchedulerData = cron.schedule('*/15 * * * * *', InteractiveVideoScheduler);
let ChannelSchedulerData = cron.schedule('*/10 * * * * *', ChannelScheduler);

module.exports = {
    InteractiveVideoSchedulerData,
    ChannelSchedulerData
}