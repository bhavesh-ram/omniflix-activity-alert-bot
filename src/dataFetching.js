let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { auctionData } = require("../models/auction.model");
const { userData } = require("../models/user.model");
const { bidsData } = require("../models/bids.model");


let options = { json: true };
let now = new Date()

let auctionFetch = cron.schedule('5 * * * * *', () => {
    request(process.env.AUCTION_URL, options, async (error, res, body) => {

        if (error) {
            return console.log(error)
        } else if (!error && res.statusCode == 200) {
            let data = body.result.list
            let doc = {}
            data.forEach((auction) => {
                // console.log(auction._id)
                auctionData.findOne({
                    "auctionId": auction._id
                }, (erro, result) => {
                    if (erro) {
                        return console.log(erro)
                    } else if (result) {
                        // console.log(result)
                        doc.startTime = auction.start_time
                        doc.endTime = auction.end_time
                        auctionData.findOneAndUpdate({
                            "auctionId": auction._id
                        },{
                            $addToSet: doc,
                        })
                    } else {
                        doc.auctionId = auction._id
                        doc.startTime = auction.start_time
                        doc.endTime = auction.end_time
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


        };
    });
});

// let bidDataFetching = async () => {
//     let auctionIds = []
//     let auctions = await auctionData.find(
//         {
//             $and: [{ startTime: { $lte: new Date(now) } },
//             { endTime: { $gte: new Date(now) } }]

//         }
//     )

//     auctionIds.splice(0,)
//     auctions.forEach(auction => {
//         auctionIds.push(auction.auctionId)
//     })
//     console.log(auctionIds.length)
//     auctionIds.forEach(Ids => {
//         let url = `https://data-api.omniflix.studio/bids?statuses[]=PLACED&statuses[]=ACCEPTED&statuses[]=CLOSED&order=desc&auctionId=${Ids}&limit=1000`
//         request(url, options, async (error, res, body) => {
//             if (error) {
//                 return console.log(error)
//             } else if (!error && res.statusCode == 200) {
//                 // console.log(res.statusCode)
//                 // console.log(body.result)
//                 // if (body.result.bid.length) {
//                     let doc = {}
//                     let bids = body.result.bid
//                     // console.log(body.result.count)
//                     let count =1
//                     bids.forEach(bid => {
//                         // let doc = {}
//                         console.log("1")
//                         // count++
//                         doc.bidder = bid.bidder,
//                         doc.created_at = bid.created_at,
//                         doc.updated_at = bid.updated_at,
//                         doc.bidId = bid._id,
//                         doc.status = bid.status
//                         doc.owner = bid.auction.owner,
//                         doc.nftId = bid.nft_id._id,
//                         doc.auctionId = bid.auction._id,
//                         doc.denomId = bid.denom_id._id                       
//                         console.log("2")
//                         let bidd = new bidsData(doc)
//                         console.log("3")
//                         bidd.save(async (error) => {
//                             if (error) {
//                                 console.log(error)
//                             }
//                         })
//                         //     // bidsData.findOneAndUpdate({
//                         //     //             "auctionId":bid.auction._id,
//                         //     //             "nft_id": bid.nft_id._id

//                         //     //         },{

//                         //     //             $addToSet:{bidderDetail:{
//                         //     //                     bidder: bid.bidder,
//                         //     //                     created_at: bid.created_at,
//                         //     //                     updated_at: bid.updated_at,
//                         //     //                     bidId: bid._id,
//                         //     //                     status: bid.status
//                         //     //                 }}

//                         //     //         },async (error)=>{
//                         //     //             if(error){
//                         //     //                 console.log(error)
//                         //     //             }
//                         //     //         })


//                         //     //  bidsData.findOneAndUpdate({
//                         //     //     "auctionId":bid.auction._id,
//                         //     //     "nft_id": bid.nft_id._id

//                         //     // },{

//                         //     //     $addToSet:{bidderDetail:{
//                         //     //             bidder: bid.bidder,
//                         //     //             created_at: bid.created_at,
//                         //     //             updated_at: bid.updated_at,
//                         //     //             bidId: bid._id,
//                         //     //             status: bid.status
//                         //     //         }}

//                         //     // },async (error)=>{
//                         //     //     if(error){
//                         //     //         console.log(error)
//                         //     //     }
//                         //     // })
//                         //     // let bidd = new bidsData(doc)
//                         //     // // console.log("3")
//                         //     // bidd.save(async (error) => {
//                         //     //     if (error) {
//                         //     //         console.log(error)
//                         //     //     }
//                         //     // })

//                     })

//                 // }
//             }
//         })
//     })

// }
// let bidsFetch = cron.schedule('1 * * * * *', bidDataFetching)



// let bidsFetch = cron.schedule('10 * * * * *', async () => {
//     let auctions = await auctionData.find(
//         {
//             $and: [{ startTime: { $lte: new Date(now) } },
//             { endTime: { $gte: new Date(now) } }]

//         }
//     )
//     // console.log(result.length)
//     auctionIds.splice(0,)
//     auctions.forEach(auction => {
//         auctionIds.push(auction.auctionId)
//     })

//     auctionIds.forEach(Ids => {
//         let url = `https://data-api.omniflix.studio/bids?statuses[]=PLACED&statuses[]=ACCEPTED&statuses[]=CLOSED&auctionId=${Ids}&limit=1000`
//         request(url, options, async (error, res, body) => {
//             if (error) {
//                 return console.log(error)
//             } else if (!error && res.statusCode == 200) {
//                 // console.log(body.result.bid.length)
//                 if (body.result.bid.length) {
//                     let doc = {}
//                     let data = body.result.bid
//                     // console.log(body.result.bid)
//                     data.forEach(bid => {
//                         // console.log("1")
//                         doc.bidderDetail = [
//                             {
//                                 bidder: bid.bidder,
//                                 created_at: bid.created_at,
//                                 updated_at: bid.updated_at,
//                                 bidId: bid._id,
//                                 status: bid.status
//                             },
//                         ],
//                             doc.owner = bid.auction.owner,
//                             doc.nftId = bid.nft_id._id,
//                             doc.auctionId = bid.auction._id,
//                             doc.denomId = bid.denom_id._id
//                         // console.log("2")
//                         let bidd = new bidsData(doc)
//                         // console.log("3")
//                         bidd.save(async (error) => {
//                             if (error) {
//                                 console.log(error)
//                             }
//                         })
//                          bidsData.findOneAndUpdate({
//                                     "auctionId":bid.auction._id,
//                                     "nft_id": bid.nft_id._id

//                                 },{

//                                     $addToSet:{bidderDetail:{
//                                             bidder: bid.bidder,
//                                             created_at: bid.created_at,
//                                             updated_at: bid.updated_at,
//                                             bidId: bid._id,
//                                             status: bid.status
//                                         }}

//                                 },async (error)=>{
//                                     if(error){
//                                         console.log(error)
//                                     }
//                                 })


//                         //  bidsData.findOneAndUpdate({
//                         //     "auctionId":bid.auction._id,
//                         //     "nft_id": bid.nft_id._id

//                         // },{

//                         //     $addToSet:{bidderDetail:{
//                         //             bidder: bid.bidder,
//                         //             created_at: bid.created_at,
//                         //             updated_at: bid.updated_at,
//                         //             bidId: bid._id,
//                         //             status: bid.status
//                         //         }}

//                         // },async (error)=>{
//                         //     if(error){
//                         //         console.log(error)
//                         //     }
//                         // })
//                         // let bidd = new bidsData(doc)
//                         // // console.log("3")
//                         // bidd.save(async (error) => {
//                         //     if (error) {
//                         //         console.log(error)
//                         //     }
//                         // })

//                     })

//                 } else {
//                     console.log("no bid Placed")
//                 }
//             }
//         })
//     })


// });

// bidsFetch.start()

module.exports = {
    auctionFetch,
    // bidsFetch
}