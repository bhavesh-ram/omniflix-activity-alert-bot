let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { channelsData } = require("../models/channels.model");

let channelsFetching = async () => {
    await channelsData.find({}, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 10
    }, async (error, result) => {
        if (error) {
            console.log(error)
        } else if (result) {
            let url = `${process.env.STUDIO_API_URL}/tv/channels?createdFrom=${new Date(result[0].created_at).toUTCString()}&sortBy=created_at&order=asc&limit=1000`
            
            let options = { json: true };  
            request(url, options, async (error, res, body) => {
                if (error) {
                    return console.log(error)
                } else if (!error && res.statusCode == 200) {
                    let channels = body.result.list
                    channels.forEach(channel => {
                        channelsData.findOne({
                            "_id":channel._id
                        }, async (error, result) => {
                            if (error) {
                                console.log(error)
                            } else if (result) {
                                console.log("Channels Result Already Present!")
                            } else {
                                channel.isNotified=false
                                let channelD = new channelsData(channel)
                                channelD.save()

                            }
                        })
                    })
                }
            })
        }
    });
};

let channelsFetch = cron.schedule('*/45 * * * * *', channelsFetching)

channelsFetch.start()


module.exports = {
    channelsFetch
}