let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()

const { listData } = require("../models/list.model");


let options = { json: true };


let { promisify } = require('util');
let requestPromise = promisify(request,{multiArgs: true});

let requestObject =async ()=>{
    let data = await requestPromise(process.env.LISTING_URL, options)
    .catch((error)=>{
        console.log(`Error ocurd while fetching data ${error}`);
    })
    let listingsId = data.body.result.list;
  
    listingsId.forEach(async (Ids)=>{
        let result = await listData.findOne({listId:Ids.id});
        
        if(result){
            return;
        }
       
        let doc = {}
        doc.listId = Ids.id;
        doc.nftId = Ids.nft.id;
        let listSave = new listData(doc);
        await listSave.save()
        .catch((error)=>{
            console.log(`Error occured while saving data ${error}`);
        })
        
    })
}
let listingsFetch = cron.schedule('30 * * * * *',requestObject);

listingsFetch.start()

module.exports = {
    listingsFetch
}