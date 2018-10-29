//index.js
//获取应用实例
const app = getApp()

const userInfo = app.globalData.userInfo;
console.log(userInfo)
Page({
  data: {
    userInfo: {
      avatarUrl: 'userInfo.avatarUrl',
      nickName: '王某人',
      isAuthen: true
    } ,
   orders: [
      {
        shop: "某某店铺",
        goodname: '新鲜草莓阿萨德六块腹肌阿里山的叫法',
        goodimg: '/img/banner.jpg',
        price: 133.22,
        num: 1,
        discount: 5,
        payment: 128.22,
        id: "0101010",
        state: 0,
        paytype: 1,
        phone: '18311111020'
      }
    ],
  },
  tapTo(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },
  handleChange(key){
    console.log(key)
    wx.navigateTo({
      url: '/pages/orderList/orderList'
    })
  },
  onLoad:function(option){
    console.log(app.globalData.userInfo.nickName)      
    let userInfo = app.globalData.userInfo;
    this.setData({
        'userInfo.nickName': userInfo.nickName,
         'userInfo.avatarUrl': userInfo.avatarUrl

      })
  }
})
