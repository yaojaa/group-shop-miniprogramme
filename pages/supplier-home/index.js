const util = require('../../utils/util.js')
import data from '../../utils/city_data'
import { $wuxToptips } from '../../wux/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    info: {}
  },
  bindRegionChange(e) {},
  getSuppInfo() {
    util.wx
      .get('/api/seller/get_supplier_detail?supplier_id=' + this.id)
      .then(res => {
        this.setData({
          info: res.data.data
        })
        wx.setNavigationBarTitle({
          title: this.data.info.supplier_name
        }) 
      })
  },
  getgoodsInfo() {
    util.wx
      .get('/api/seller/get_supplier_goods?supplier_id=' + this.id)
      .then(res => {
        this.setData({
          goodsList: res.data.data.list
        })
      })
  },

  goods_up(e) {
    console.log('go', e)

    const { id } = e.target.dataset

    wx.navigateTo({
      url: '/pages/goods-up/index?supid=' + id
    })
  },

  onLoad(option) {
    this.id = option.id

    this.getSuppInfo()
    this.getgoodsInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}
})
