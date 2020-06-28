const util = require('../../utils/util.js')

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
  getgoodsInfo() {
    this.setData({
      loading: true,
    })
    return util.wx
      .post('/api/helper/get_store_goods_for_helper', {
        store_id: this.id,
        cpage: this.data.cpage,
        pagesize: 20,
      })
      .then((res) => {
        this.setData({
          loading: false,
          totalpage: res.data.data.page.totalpage,
          goodsList: this.data.goodsList.concat(res.data.data.list),
        })
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
    this.getgoodsInfo()
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
        cpage: ++this.data.cpage,
      })
      if (this.data.cpage > this.data.totalpage) {
        return
      }
      this.getgoodsInfo().then(() => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
    }
  },
})
