// pages/paySuccess/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: false,
    order_id:'',
    ordersInfo:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.order_id = options.order_id

    console.log(options)
   this.getOrderInfo()
    

  },

  getOrderInfo(){

     wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_detail',
            data: {
                token: app.globalData.token,
                order_id:this.data.order_id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        orders: res.data.data
                    })
                }
            }
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
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: app.globalData.userInfo.nickName + '刚刚购买了',
      path: '/pages/goods/goods'
    }
  }
})