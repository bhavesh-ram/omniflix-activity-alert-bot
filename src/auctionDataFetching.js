let request = require("request")
var cron = require('node-cron');
const { auctionData } = require("../models/auction.model");

let url = "https://data-api.omniflix.studio/auctions?verified=true&ipInfringement=false&sortBy=created_at&order=desc&limit=1000";

let options = { json: true };


let auctionFetch = cron.schedule('* 1 * * * *', () => {
    request(url, options, async (error, res, body) => {
       
        if (error) {
            return console.log(error)
        } else if (!error && res.statusCode == 200) {
            let data = body.result.list
            let doc = {}
            let count = 0
            data.forEach((auction) => {
                auctionData.findOne({
                    "auctionId": auction._id
                }, (erro, result) => {
                    if (erro) {
                        return console.log(erro)
                    } else if (result) {
                        // console.log(result)
                        return count++
                    } else {
                        doc.auctionId = auction._id
                        doc.startTime = new Date(auction.start_time)
                        doc.endTime = new Date(auction.end_time)
                        doc.nftId = auction.nft_id
                        let auctiond = new auctionData(doc)
                        auctiond.save(async (err) => {
                            if (err) {
                                return console.log("error")
                            } 

                        })

                    }


                })


            })
            console.log("successfully added!")

        };
    });
});

module.exports = {
    auctionFetch
}