//index.js
//
//
//
//获取应用实例
var WxValidate = require("../../utils/wxValidate.js");

console.log(WxValidate)

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
  switch2Change:function(e){
    this.setData({ hasType: e.detail.value})
  },
  deliverChange: function (e) {
    this.setData({ deliver: e.detail.value })
  },
  chooseMap:function(e){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          success:function(res){
            console.log(res)
          }
        })
      }
    })

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  initValidate:function(){
        // 验证字段的规则
        const rules = {
            title:{
              required:true
            },
            content:{
              required:true
            }
        }

        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            title:{
              required:'请输入标题'
            },
            content:{
              required:'请输入描述'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)


  },
  //提交表单
    submitForm(e) {
        
        const params = e.detail.value
 // 传入表单数据，调用验证方法
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0]
            wx.showModal({title:error.msg,showCancel:false})
            return false
        } 
 wx.showModal({
            title: '提交成功',
            showCancel:false
        })
     
    },
  onLoad: function () {

    this.initValidate()


 

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
