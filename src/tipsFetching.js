let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { tipData } = require("../models/tip.model");

let tipFetching = async () => {
    await tipData.find({}, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 10
    }, async (error, result) => {
        if (error) {
            console.log(error)
        } else if (result) {
            let url = `${process.env.STUDIO_API_URL}/tips?sortBy=created_at&order=desc&limit=1000`
            let options = { json: true };  
            request(url, options, async (error, res, body) => {
                if (error) {
                    return console.log(error)
                } else if (!error && res.statusCode == 200) {
                    let tips = body.result.list
                    tips.forEach(tip => {
                        tipData.findOne({
                            "_id":tip._id
                        }, async (error, result) => {
                            if (error) {
                                console.log(error)
                            } else if (result) {
                                console.log("Tips Data Already Present!")
                            } else {
                                tip.isNotified=false
                                let tipD = new tipData(tip)
                                tipD.save()

                            }
                        })
                    })
                }
            })
        }
    });
};

let tipFetch = cron.schedule('*/10 * * * * *', tipFetching)

tipFetch.start()

module.exports = {
    tipFetch
}