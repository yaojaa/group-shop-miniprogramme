const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    showAuth: false,
    suppList: {},
    helpSaleList:[],
    groupUserList:[]
  },
  onLoad: function(e) {
    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
      this.setData({
        showAuth: true
      })
    }

    this.getMySupp()
    this.getMyHelpSale()
    this.getMyHelpSaleUser()
  },

  toSupphome(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../supplier-home/index?id=' + id
    })
  },

  //获取我的帮卖成员
  //
  getMyHelpSaleUser(){

     wx.showLoading()
    util.wx.get('/api/helper/store_helper_list').then(res => {
        wx.hideLoading()

      if(res.data.code == 200){
      this.setData({
        groupUserList: res.data.data
      })
    }else{

    }
    }).catch(e=>{
      wx.showToast({
        title:'服务器休息一下 请稍后'
      })
    })



   

  },


  //获取我加入的帮卖店铺
  getMyHelpSale(){

  
    wx.showLoading()
    util.wx.get('/api/helper/joined_store_list').then(res => {
        wx.hideLoading()

      if(res.data.code == 200){
      this.setData({
        helpSaleList: res.data.data.list
      })
    }else{

    }
    }).catch(e=>{
      wx.showToast({
        title:'服务器休息一下 请稍后'
      })
    })



  },

  getMySupp() {
    wx.showLoading()
    util.wx.get('/api/seller/my_supplier_list').then(res => {
        wx.hideLoading()

      if(res.data.code == 200){
      this.setData({
        suppList: res.data.data.list
      })
    }else{

    }
    }).catch(e=>{
      wx.showToast({
        title:'服务器休息一下 请稍后'
      })
    })
  },
  rejectAuth() {
    this.setData({
      showAuth: false
    })
  },
  onShow: function() {
    wx.hideHomeButton()

},
  onShareAppMessage: function(e) {
    const { supplier_id, name } = e.target.dataset
    const username = app.globalData.userInfo.nickname
    console.log('business/pages/acting-apply/index' + '?supplier_id=' + supplier_id)
    return {
      title: username + '邀请您加入' + name,
      imageUrl: 'https://static.kaixinmatuan.cn/staticinvitation2.jpg',
      path: 'business/pages/acting-apply/index' + '?supplier_id=' + supplier_id
    }
  }
})
