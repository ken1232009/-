// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  const db = cloud.database()
  const _ = db.command
  const $ = db.command.aggregate
  console.log('event', event)

  var dat = new Date()
  var year = dat.getFullYear()
  var month = dat.getMonth() + 1
  var day = dat.getDate()
  var fdat = year + '/' + ('00'+month).slice(-2) + '/' + ('00'+day).slice(-2)

  if (event.mode == 'add_user'){
    return new Promise((resolve, reject) => {
      db.collection('user').add({
        data:{
          openid: openid,
          // nickName: event.name,
          // avatar: event.avatar
        }
      })
    })
  }
  else if (event.mode == 'add_want'){
    return new Promise((resolve, reject) => {
      const fs = require('fs')
      const path = require('path')
      // const fileStream = fs.createReadStream(event.image)
      db.collection('want').add({
        data:{
          openid: openid,
          want: event.want,
          price: event.price,
          wantPrice: event.wantPrice,
          image: event.image,
          date: dat,
          status: 'want'
        }
      })
      .then(res=>{
        db.collection('asset').add({
          data:{
          openid: openid,
          type: 'deposit',
          amount: Number(event.deposit),
        }})
        db.collection('asset').add({
          data:{
          openid: openid,
          type: 'cashin',
          amount: Number(event.cashin),
        }})
        db.collection('asset').add({
          data:{openid: openid,
          type: 'investment',
          amount: Number(event.investment),
        }})
        db.collection('asset').add({
          data:{openid: openid,
          type: 'fixedasset',
          amount: Number(event.fixedasset),
        }})
        db.collection('liability').add({
          data:{openid: openid,
          type: 'loanout',
          amount: Number(event.loanout),
        }})
        db.collection('liability').add({
          data:{openid: openid,
          type: 'cashout',
          amount: Number(event.cashout),
        }})
        db.collection('liability').add({
          data:{openid: openid,
          type: 'loanTotal',
          amount: Number(event.loanTotal),
        }})
        db.collection('liability').add({
          data:{openid: openid,
          type: 'liabilityTotal',
          amount: Number(event.liabilityTotal),
        }})
      })
      .then(res=>{
        db.collection('user').add({
          data:{
            openid: openid
          }
        })
        var asset = Number(event.deposit) + Number(event.investment) +Number(event.fixedasset) - Number(event.loanTotal) - Number(event.liabilityTotal)
        var cashflow = Number(event.cashin) - Number(event.cashout) - Number(event.loanout)
        if (asset< Number(event.price) && cashflow <= 0){
          resolve([asset, cashflow, '看来还是要多赚一点钱哦',event.image])
        }
        else if (asset>= Number(event.price) && cashflow <= 0){
          resolve([asset, cashflow, '今朝有酒今朝醉，买完之后'+((asset-Number(event.price))/cashflow*-1).toString()+'个月就破产啦',event.image])
        }
        else if(asset / 5 > Number(event.price)){
          resolve([asset, cashflow, '随意买壕大大',event.image])
        }
        else if(asset / 2 >= Number(event.price)){
          resolve([asset, cashflow, '勉强还是可以买一下哦',event.image])
        }
        else if(asset < Number(event.price)){
          resolve([asset, cashflow, '要不再等'+((Number(event.price)-asset)/cashflow).toString()+'个月？一不小心就要卖肾了',event.image])
        }
        else{
          if (Number(event.wantPrice /2 >= event.price)){
            resolve([asset, cashflow, '很想要的话就买了吧',event.image])
          }
          else{
            resolve([asset, cashflow, '喝口水冷静冷静...买它！',event.image])
          }
        }
      })
    })
  }
}