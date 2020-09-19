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

  if (event.mode == 'user_exist'){
    return new Promise((resolve, reject) => {
      db.collection('user').where({
        openid: openid
      }).get()
      .then(res => {
        if (res.data.length == 0){
          resolve('New')
        }
        else{resolve('Exist')}
      })
    })
  }
}