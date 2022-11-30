// https://omniflix.market/nft/onft1573f151b21b45489584c034c5140ae7


var cron = require('node-cron');
const { userData } = require('../models/user.model');

let notificationSend =  cron.schedule('* * * * * *', () => {

    userData.find({
        "isSubscribe":true
    },async (error,result) =>{
        if(error){
            return console.log(error)
        }else if(result && result.length){
            result.forEach(user =>{
                
            })
        
        }else{
            return console.log("no User subscribed")
        }
    })
    // const target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}`
    // https.get(target, (res) => {
    //     console.log('notif telegram sent')
    // })
});

module.exports ={
    notificationSend
}