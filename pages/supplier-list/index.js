const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    showAuth: false,
    suppList: {}
  },
  onLoad: function(e) {
    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
      this.setData({
        showAuth: true
      })
    }

    this.getMySupp()
  },

  toSupphome(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../supplier-home/index?id=' + id
    })
  },

  getMySupp() {
    wx.showLoading()
    util.wx.get('/api/seller/my_supplier_list').then(res => {
      this.setData({
        suppList: res.data.data.list
      })
      wx.hideLoading()
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
    return {
      title: username + '邀请您加入' + name,
      imageUrl: 'https://static.kaixinmatuan.cn/staticinvitation2.jpg',
      path: 'business/pages/acting-apply/index' + '?supplier_id=' + supplier_id
    }
  }
})
