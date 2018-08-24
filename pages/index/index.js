//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '甘露园南里二区',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      '/img/banner.jpg'
    ]
  },
  onLoad: function () {
    this.getProList()
  },
  getProList(){
    wx.request({
      url: 'https://www.easy-mock.com/mock/5b344e59f512b5707142bfaa/groupShop/list',
      method:'GET',
      success:res => {
        this.setData({
          proList:res.data.data
        })
      },
      fail:err => {
        console.log(err)
      }
    })
  },
  toDetail(e){
    let postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: '../goods/goods?id='+postId,
    })
  },
  addGoods() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  }
})
