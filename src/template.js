let StartMsg = `Hello {USER_NAME},\nExplore NFTs & Interactive content on #OmniFlix. Enter /help for a list of commands.`

let HelpMsg =
  `Connect with @OmniFlix_Alert_bot to stay updated. Type /subscribe to begin.\n
    HERE ARE THE AVAILABLE COMMANDS AND THEIR UTILITY
     /about - About Bot
     /omniflix - About OmniFlix
	   /subscribe - Subscribe to receive the latest alerts on NFTs, auctions, and Interactive Videos right in your inbox.
	   /unsubscribe - Unsubscribe from Alerts/Updates
     /join - Join the action! Subscribe to the bot for personalized updates from the OmniFlix Market & OmniFlix TV
     /interested - Reactivate notifications you've muted.
     /notinterested - Mute notifications you no longer wish to receive.
     /changeaddress - Update your OmniFlix address for personalized notifications.
     /subscribechannel - Receive notifications from a specific OmniFlix TV channel.
     /unsubscribechannel - Stop getting updates from an OmniFlix TV channel you've followed.
     `
let aboutBot = `OmniFlix Alert Bot brings all your your activity notifications on OmniFlix Market & OmniFlix TV, in one place.`
let aboutOmniflix = `OmniFlix is a p2p network for creators & sovereign communities to Mint, manage,\ndistribute and monetize their Intellectual Property and community interactions.`
let joinBot = `Get in on the NFT action:\nLink up with @OmniFlix_Alert_bot on Telegram. Simply type /help or /subscribe to complete your setup.`

let createAuctionMsg = {
  message: `***New NFT Auction Live!***  
Starts:***{START_DATE}***,Ends:***{END_DATE}***  
Bid now: https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID} `
};


let cancelAuctionMsg = {
  message: ` ***Auction Cancelled.***  
Details: https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}

let removeAuctionMsg = {
  message: ` ***Auction Removed From Marketplace. ***`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}



let processBidAuctionHelperMsg = {
  auctionWonMsg: ` ***Congratulations!*** You've won the auction.    
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  auctionEndMsg: ` ***Auction Ended.***   
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`

}



let placeBidAuctionHelperMsg = {
  ownerMsg: ` ***Your auction received a new bid!***     
https://omniflix.market/nft/{NFTID}`,

  bidderMsg: ` ***You've placed a new bid. Good luck!***  
https://omniflix.market/nft/{NFTID}`,

  previousBidderMsg: ` ***Outbid alert! Time to raise your game!***   
https://omniflix.market/nft/{NFTID}`,

  url: `https://omniflix.market/nft/{NFTID}`

}



let buyNftHelperMsg = {
  NftOwnerMsg: ` ***NFT Sold:***:  https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  NftBuyerMsg: ` ***New NFT added to your collection!***  https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,
  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`

}



let burnNftHelperMsg = {
  message: ` ***You Burned an NFT from OmniFlix Market.***  
https://omniflix.market/nft/{ACTIVITYID}`,
  url: `https://omniflix.market/nft/{ACTIVITYID}`
}


let mintONFTHelperMsg = {
  creatorMsg: `***You've minted a new NFT!***  
https://omniflix.market/nft/{NFTID)`,

  ownerMsg: `***A new NFT has been minted into your account.***  
https://omniflix.market/nft/{NFTID}`,

  url: `https://omniflix.market/nft/{NFTID}`


}

let transferDenomHelperMsg = {
  senderMsg: `***You transferred a collection to*** {ACTIVITYDATARECIPIENT}.  
https://omniflix.market/collection/{DENOMID}`,

  receiverMsg: `***You received a collection from*** {ACTIVITYDATACREATOR}.  
https://omniflix.market/collection/{DENOMID}`,

  url: `https://omniflix.market/collection/{DENOMID}`


}

let createDenomHelperMsg = {
  message: `***Your collection is live!***  
Symbol:  {SYMBOL}  
Name:  {NAME}.  
View it: https://omniflix.market/collection/{DENOMID}`,

  url: `https://omniflix.market/collection/{DENOMID}`
}

let updateDenomHelperMsg = {
  message: `***Collection Updated!***  
**Symbol:  {SYMBOL}**  
**Name:  {NAME} **  
https://omniflix.market/collection/{DENOMID}`,

  url: `https://omniflix.market/collection/{DENOMID}`
}


let listingHelperMsg = {
  message: ` ***New Listing Alert! ***Check out the latest on OmniFlix Market:  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}


let delistingHelperMsg = {
  message: ` ***You delisted an NFT from OmniFlix Market.***  
https://omniflix.market/nft/{ACTIVITYNFT_IDID}`,

  url: `https://omniflix.market/nft/{ACTIVITYNFT_IDID}`
}



let transferNftHelperMsg = {
  senderMsg: ` ***You transferred an NFT.***  
https://omniflix.market/nft/{ACTIVITYID}`,

  receiverMsg: ` ***You received an NFT!***  
https://omniflix.market/nft/{ACTIVITYID}`,

url:`https://omniflix.market/nft/{ACTIVITYID}`


}


let createCampaignMsg = {
  message: `***New Campaign created on OmniFlix!***  
Starts:***{START_DATE}***,  
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
  message: ` ***Campaign Deposit made.***  
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
  senderMsg: ` ***ou transferred an NFT.***  
https://omniflix.market/nft/{ACTIVITYID}`,

  receiverMsg: ` ***You received an NFT.***  
https://omniflix.market/nft/{ACTIVITYID}`,

url:`https://omniflix.market/nft/{ACTIVITYID}`
}

let streamSendHelperMsg = {
  senderMsg: ` ***You sent a Stream.***  
https://streampay.me/streams/{ACTIVITYID}`,

  receiverMsg: ` ***You received a Stream.***  
https://streampay.me/streams/{ACTIVITYID}`,

url:`https://streampay.me/streams/{ACTIVITYID}`
}

let StopStreamMsg = {
  message: ` ***Stream Stopped. See details:***  
https://streampay.me/streams/{ACTIVITYNFT_IDID}`,
  url: `https://streampay.me/streams/{ACTIVITYNFT_IDID}`
}

let claimStreamedAmountMsg = {
  message: ` ***You claimed {AMOUNT} FLIX from a Stream.***  
https://streampay.me/streams/{ACTIVITYNFT_IDID}`,
  url: `https://streampay.me/streams/{ACTIVITYNFT_IDID}`
}

let NewIVPublishedHelperMsg = {
  message: `New Interactive Video: [{IV_NAME}](https://omniflix.tv/iv/{IV_ID}) by [{CHANNEL_NAME}](https://omniflix.tv/channel/{CHANNEL_ID) published on OmniFlix.tv!  

https://omniflix.tv/iv/{IV_ID}`,

  url: `https://omniflix.tv/iv/{IV_ID}`
}

let NewChannelsHelperMsg = {
  message: `New Channel Alert: [{CHANNEL_NAME}](https://omniflix.tv/channel/{CHANNEL_ID}) now on OmniFlix.tv!

https://omniflix.tv/channel/{CHANNEL_ID}`,

  url: `https://omniflix.tv/channel/{CHANNEL_ID}`
}

let ReceivedTipOnChannelMsg = {
  message: ` ***You Received {AMOUNT} FLIX as Tip on {CHANNEL_USERNAME}***`,
}

let ReceivedTipOnIVMsg = {
  message: ` ***You Received {AMOUNT} FLIX as Tip on [{IV_NAME}](https://omniflix.tv/iv/{IV_ID})***   
  https://omniflix.tv/iv/{IV_ID}`,

  url: `https://omniflix.tv/iv/{IV_ID}`
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

  ReceivedTipOnChannelMsg,
  ReceivedTipOnIVMsg
}
