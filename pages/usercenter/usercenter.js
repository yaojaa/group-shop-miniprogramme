//index.js
//获取应用实例
const app = getApp()

const userInfo = app.globalData;

Page({
  data: {
    userInfo: {
      photo: "/img/banner.jpg",
      name: '王某人',
      isAuthen: true
    }
  },
  tapTo(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },
  onLoad:function(option){
    console.log(option, app.globalData.userInfo)
    let userInfo = app.globalData.userInfo;
    this.setData(userInfo)
  }
})
