// pages/publish-setting/index.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

      data: {
        show_buyerlist: true
      },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      show_buyerlist:options.show_buyerlist==0?false:true
    })

  },
  onChange({ detail }) {
    // 需要手动对 show_buyerlist 状态进行更新
    this.setData({ show_buyerlist: detail });
    console.log(detail)
  },

  save(){
    util.setParentData({
      show_buyerlist:this.data.show_buyerlist?1:0 //是否展示下单人 show_buyerlist 0:默认 1:不展示   可不传
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})