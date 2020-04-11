const util = require('../../utils/util.js')
import data from '../../utils/city_data'
import { $wuxToptips } from '../../wux/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    info: {},
    active: 2,
    loading: false,
    cpage: 1,
    totalpage: 1,
  },
  bindRegionChange(e) {},
  getSuppInfo() {
    util.wx
      .get('/api/seller/get_supplier_detail?supplier_id=' + this.id)
      .then((res) => {
        this.setData({
          info: res.data.data,
        })
        wx.setNavigationBarTitle({
          title: this.data.info.supplier_name,
        })
      })
  },
  getgoodsInfo() {
    this.setData({
      loading: true,
    })
    return new Promise((resolve, reject) => {
      util.wx
        .get('/api/seller/get_supplier_goods', {
          supplier_id: this.id,
          cpage: this.data.cpage,
          pagesize: 10,
        })
        .then((res) => {
          this.setData({
            loading: false,
            totalpage: res.data.data.page.totalpage,
            goodsList: [...res.data.data.list],
          })
          resolve()
        }),
        (err) => {
          reject(err)
        }
    })
  },

  goods_up(e) {
    const { id } = e.target.dataset

    wx.navigateTo({
      url: '/pages/goods-up/index?supid=' + id,
    })
  },

  onLoad(option) {
    this.id = option.id

    this.getSuppInfo()
    this.getgoodsInfo()
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.cpage && !this.data.loading) {
      this.setData({
        cpage: this.data.cpage + 1, //每次触发上拉事件，把requestPageNum+1
      })
      if (this.data.cpage > this.data.totalpage) {
        return
      }
      this.getgoodsInfo().then(() => {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh()
      })
    }
  },
})
