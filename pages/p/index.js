import Card from '../../palette/card';
const app = getApp()
Page({
  data: {
    scrollTop:0,
    painterData:{},
    imagePath:"",

  },
  onLoad: function (options) {

  },
  onReady: function () {
    console.log("p==", app.globalData.userInfo)
    this.setData({
      painterData: new Card().palette("sfsfsafasdflajsflj"),
    });

  },
  onImgOk(e){
    this.data.imagePath = e.detail.path;
    this.setData({
      imagePath: e.detail.path
    })



    console.log("===========",e)
  },
  onImgErr(e) {
    console.log("=======>>>>", e)
  },
  onShareAppMessage: function (res) {
    console.log("--------------",this.data.imagePath)

    this.setData({
      scrollTop: 125
    })
    return {
      title: `${app.globalData.userInfo.nickName}刚刚下单成功了`,
      path: '/pages/goods/goods',
      imageUrl: this.data.imagePath
    }
  }
})
