//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640'
    ]
  },
  onLoad:function(option){
    console.log(option)
  },
  homepage(){
    wx.navigateTo({
      url: '../home/index'
    })
  },
  userpage() {
    console.log('userpage')
    wx.navigateTo({
      url: '../ucenter/ucenter'
    })
  },
  buy() {
    wx.navigateTo({
      url: '../order/index'
    })
  }
})
