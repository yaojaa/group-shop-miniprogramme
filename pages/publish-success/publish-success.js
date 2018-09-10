//index.js
//
//
//
//获取应用实例
var WxValidate = require("../../utils/wxValidate.js");

//console.log(WxValidate)

const app = getApp()



Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    title: '',
    content: '',
    price: 5000,
    hasType:false,
    type: {},
    isGave:0,
    address:0,
    deliver:true,
  },
  onLoad:function(){
   
  },
  viewGoods:function(){

    wx.navigateTo({
            url: '../goods/goods'
     })
              
  }
})
