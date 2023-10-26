let StartMsg = `Hello {USER_NAME},\nEnter /help To get list of all commands`

let HelpMsg =
  `
    HERE ARE THE AVAILABLE COMMANDS AND THEIR UTILITY
     /about - About Bot
     /omniflix - About OmniFlix
	   /subscribe - Subscribe to get the latest NFTs, Auctions, and Collection listings notifications in your inbox.
	   /unsubscribe - unsubscribe from Alerts/Updates
     /join - join bot and subscribe to get personal updates of Marketplace
     `
let aboutBot = `OmniFlix Alert bot helps you get notifications for Auctions, Collections & more on OmniFlix.Market - all in one place.`
let aboutOmniflix = `OmniFlix is a p2p network for creators & sovereign communities to Mint, manage, distribute and monetize their Intellectual Property and community interactions.`
let joinBot = `Get in on the NFT action!\nConnect @OmniFlix_Alert_bot to your telegram with the link below.\nType /help or "/subscribe" to finish setup.`

let createAuctionMsg = {
  message: `***New NFT Auction! Bid now on OmniFlix.Market***  
Starts:***{START_DATE}***  
Ends:***{END_DATE}***   
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
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

let createDenomHelperMsg = {
  message: `***Your collection has been created.***  
**Symbol:  {SYMBOL}**  
**Name:  {NAME} **  
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
  message: ` ***Alert 🚨 Fresh listing on OmniFlix.market !***  
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


let createCampaignMsg = {
  message: `***New Campaign Created on OmniFlix.Market***  
Starts:***{START_DATE}***  
Ends:***{END_DATE}***   
https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/campaign/{ACTIVITYNFT_IDID} `
};

let cancelCampaignMsg = {
  message: ` ***Campaign Cancelled.***  
https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`
}

let depositCampaignMsg = {
  message: ` ***Deposit Campaign.***  
https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`
}

let endCampaignMsg = {
  message: ` ***Following Camaign Ended.***  
https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`
}

let claimCampaignMsg = {
  message: ` ***You Claimed from below Campaign.***  
https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/campaign/{ACTIVITYNFT_IDID}`
}

let campaignTransferNftHelperMsg = {
  senderMsg: ` ***You have transferred the below NFT..***  
https://omniflix.market/nft/{ACTIVITYID}`,

  receiverMsg: ` ***You have received an NFT***  
https://omniflix.market/nft/{ACTIVITYID}`,

url:`https://omniflix.market/nft/{ACTIVITYID}`
}

let streamSendHelperMsg = {
  senderMsg: ` ***You have Send Below Stream..***  
https://streampay.me/streams/{ACTIVITYID}`,

  receiverMsg: ` ***You have received a Stream on Streampay.me***  
https://streampay.me/streams/{ACTIVITYID}`,

url:`https://streampay.me/streams/{ACTIVITYID}`
}

let StopStreamMsg = {
  message: ` ***It Seems You Stopped Below Stream.***  
https://streampay.me/streams/{ACTIVITYNFT_IDID}`,
  url: `https://streampay.me/streams/{ACTIVITYNFT_IDID}`
}

let claimStreamedAmountMsg = {
  message: ` ***You Claimed Amount from Stream below.***  
https://streampay.me/streams/{ACTIVITYNFT_IDID}`,
  url: `https://streampay.me/streams/{ACTIVITYNFT_IDID}`
}

let NewIVPublishedHelperMsg = {
  message: ` ***Alert 🚨 Interactive Video Published OmniFlix.tv !***  
https://omniflix.tv/iv/{IV_ID}`,

  url: `https://omniflix.tv/iv/{IV_ID}`
}

let NewChannelsHelperMsg = {
  message: ` ***Alert 🚨 New Channel Created On OmniFlix.tv !***  
https://omniflix.tv/channel/{CHANNEL_ID}`,

  url: `https://omniflix.tv/channel/{CHANNEL_ID}`
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
  createDenomHelperMsg,
  transferDenomHelperMsg,
  updateDenomHelperMsg,
  listingHelperMsg,
  delistingHelperMsg,
  transferNftHelperMsg,
  createCampaignMsg,
  cancelCampaignMsg,
  depositCampaignMsg,
  endCampaignMsg,
  claimCampaignMsg,
  campaignTransferNftHelperMsg,

  streamSendHelperMsg,
  StopStreamMsg,
  claimStreamedAmountMsg,

  NewIVPublishedHelperMsg,
  NewChannelsHelperMsg,
}
