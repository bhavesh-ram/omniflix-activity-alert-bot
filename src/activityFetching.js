let request = require("request")
var cron = require('node-cron');
var fs = require('fs')
const { ActivityData } = require("../models/activity.model");
const dotenv = require('dotenv').config()


let activityFetching = async () => {
    let createdAt
    await ActivityData.find({

    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 1
    }, async (error, result) => {
        if (error) {
            console.log(error)
        } else if (result) {
            
            // console.log(result)
            let url = `https://activity-api.omniflix.studio/activity?createdFrom=${new Date(result[0].created_at).toUTCString()}&sortBy=created_at&order=asc&limit=5`
            // console.log(url)
            //     }
            // })
            // let url ="https://activity-api.omniflix.studio/activity?createdFrom=2022-12-06T03:03:01.000Z&sortBy=created_at&order=asc&limit=100"
            // let url = "https://activity-api.omniflix.studio/activity?limit=100&order=desc"
            let options = { json: true };
            request(url, options, async (error, res, body) => {
                if (error) {
                    return console.log(error)
                } else if (!error && res.statusCode == 200) {
                    let activities = body.result.list
                    // let count = 1
                    // console.log(activities.length)
                    console.log(body)
                    activities.forEach(activity => {
                        
                        ActivityData.findOne({
                            "_id":activity._id
                        }, async (error, result) => {
                            // console.log(error,result)
                            if (error) {
                                console.log(error)
                            } else if (result) {
                                console.log("Result Already Present!")
                            } else {
                                // await ActivityData.insertOne(activity)
                                activity.isNotified=false
                                let activityd = new ActivityData(activity)
                                console.log(activityd)
                                activityd.save()

                            }
                        })
                    })


                    // console.log(activities.length)
                    // await ActivityData.insertMany(activities)
                    // activities.forEach(activity => {
                    //     // console.log("a")
                    //     count++
                    //     let activityd = new ActivityData(activity)
                    //     // activityd.save()
                    //     // ActivityData.insert(activity)
                    // });
                    // console.log("count",count)

                }
            })
        }
    })
}


let activityFetch = cron.schedule('*/10 * * * * *', activityFetching)


module.exports = {
    activityFetch
}


