let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { ActivityData } = require("../models/activity.model");


let activityFetching = async () => {
    await ActivityData.find({

    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 10
    }, async (error, result) => {
        if (error) {
            console.log(error)
        } else if (result) {
        
            let url = `${process.env.ACTIVITY_URL}/activity-bot?createdFrom=${new Date(result[0].created_at).toUTCString()}&sortBy=created_at&order=asc&limit=2000`
            
            let options = { json: true };
            request(url, options, async (error, res, body) => {
                if (error) {
                    return console.log(error)
                } else if (!error && res.statusCode == 200) {
                    let activities = body.result.list
                    
                    // console.log(body)
                    activities.forEach(activity => {
                        
                        ActivityData.findOne({
                            "_id":activity._id
                        }, async (error, result) => {
                            if (error) {
                                console.log(error)
                            } else if (result) {
                                console.log("Result Already Present!")
                            } else {
                                // await ActivityData.insertOne(activity)
                                activity.isNotified=false
                                let activityd = new ActivityData(activity)
                                // console.log(activityd)
                                activityd.save()

                            }
                        })
                    })


                }
            })
        }
    })
}


let activityFetch = cron.schedule('*/20 * * * * *', activityFetching)

activityFetch.start()


module.exports = {
    activityFetch
}


