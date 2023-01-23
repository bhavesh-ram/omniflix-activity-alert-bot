let StartMsg = `Hello {USER_NAME},\nEnter /help To get list of all commands`

let HelpMsg =
  `
    HERE ARE THE AVAILABLE COMMANDS AND THEIR UTILITY
     /about - About Bot
     /omniflix - About OmniFlix
	   /subscribe - subscribe to OmniFlix Alert Bot to get Marketplace updates.(Note:-Add OmniFlix address after subscribe \ni.e. /subscribe omniflix1rtwjj6qfn62emyghhgfhhtjedv3kgd9j20tx)
	   /unsubscribe - unsubscribe from Alerts/Updates
     /join - join bot and subscribe to get personal updates of Marketplace
     `
let aboutBot = `This is a bot to help you navigate and receive notifications from the marketplace within the OmniFlix ecosystem`
let aboutOmniflix = `OmniFlix is a p2p network for creators & sovereign communities to help them mint, manage, distribute and monetise their intellectual property and community interactions.`
let joinBot = `connect the bot to get personal message. Click the link below.\n@OmniFlix_Alert_bot\nand type /help or /subscribe.\nGet all updates`

let createAuctionMsg = {
  message: `***New Auction Listed On MarketPlace***  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}  
The Auction is Starting at:  
***{START_DATE}***  
And The Auction is Ending at:  
***{END_DATE}***`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID} `
};


let cancelAuctionMsg = {
  message: ` ***Auction Cancelled.***  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}

let removeAuctionMsg = {
  message: ` ***Auction Removed From Marketplace.***  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}



let processBidAuctionHelperMsg = {
  auctionWonMsg: ` **Congratulations**  
  ***You have won the auction that you bid:***     
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  auctionEndMsg: ` ***The auction has Ended:***   
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`

}



let placeBidAuctionHelperMsg = {
  ownerMsg: ` ***Your auction just received a new bid!***     
https://omniflix.market/nft/{NFTID}`,

  bidderMsg: ` ***You have placed a new bid.***  
https://omniflix.market/nft/{NFTID}`,

  previousBidderMsg: ` ***You have been outbid (i.e. someone has placed a bid higher than yours). ***   
https://omniflix.market/nft/{NFTID}`,

  url: `https://omniflix.market/nft/{NFTID}`

}



let buyNftHelperMsg = {
  NftOwnerMsg: ` ***Nft Sold***:  https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  NftBuyerMsg: ` ***You collected a new NFT***  https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`

}



let burnNftHelperMsg = {
  message: ` ***You delisted the following NFT from the marketplace on OmniFlix.market .***  
https://omniflix.market/nft/{ACTIVITYID}`,
  url: `https://omniflix.market/nft/{ACTIVITYID}`
}


let mintONFTHelperMsg = {
  creatorMsg: `***You have minted a new NFT***  
https://omniflix.market/nft/{NFTID)`,

  ownerMsg: `***A new NFT was minted into your account***  
https://omniflix.market/nft/{NFTID}`,

  url: `https://omniflix.market/nft/{NFTID}`


}

let transferDenomHelperMsg = {
  senderMsg: `***You have transferred the below collection to***  
{ACTIVITYDATARECIPIENT}  
https://omniflix.market/collection/{DENOMID}`,

  receiverMsg: `***You have received the below collection from ***   
{ACTIVITYDATACREATOR}  
https://omniflix.market/collection/{DENOMID}`,

  url: `https://omniflix.market/collection/{DENOMID}`


}


let updateDenomHelperMsg = {
  message: `***Your collection has been updated.***  
**Symbol:  {SYMBOL}**  
**Name:  {NAME} **  
https://omniflix.market/collection/{DENOMID}`,

  url: `https://omniflix.market/collection/{DENOMID}`
}


let listingHelperMsg = {
  message: ` ***New listing on the marketplace on OmniFlix.market.***  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}


let delistingHelperMsg = {
  message: ` *** You have delisted the below NFT from OmniFlix Market.***  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}



let transferNftHelperMsg = {
  senderMsg: ` ***You have transferred the below NFT..***  
https://omniflix.market/nft/{ACTIVITYID}`,

  receiverMsg: ` ***You have received an NFT***  
https://omniflix.market/nft/{ACTIVITYID}`,

url:`https://omniflix.market/nft/{ACTIVITYID}`


}

module.exports = {
  StartMsg,
  HelpMsg,
  joinBot,
  aboutBot,
  aboutOmniflix,
  createAuctionMsg,
  cancelAuctionMsg,
  removeAuctionMsg,
  processBidAuctionHelperMsg,
  placeBidAuctionHelperMsg,
  buyNftHelperMsg,
  burnNftHelperMsg,

  mintONFTHelperMsg,
  transferDenomHelperMsg,
  updateDenomHelperMsg,
  listingHelperMsg,
  delistingHelperMsg,
  transferNftHelperMsg
}