//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640'
    ],
    proList:[]
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
  }
})
